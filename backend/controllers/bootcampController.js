const { BootcampPost, User, AuditLog } = require("../models");

exports.getAllPosts = async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause = type ? { type } : {};

    const posts = await BootcampPost.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "author", attributes: ["name", "avatar"] }], //naam aur pfp bhi dikhana he
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "error: ", error: error.message });
  }
};

// message or poll creation
exports.createMessage = async (req, res) => {
  try {
    const { title, content, type, tags, pollOptions } = req.body;

    // Save the new fields into the database
    const newPost = await BootcampPost.create({
      type: type || "message",
      title,
      content,
      tags: tags || [],
      pollOptions: pollOptions || [],
      createdBy: req.user.id, //abhi ke liye demo id
    });

    const optionsCount = pollOptions ? (Array.isArray(pollOptions) ? pollOptions.length : JSON.parse(pollOptions).length) : 0;
    const details = optionsCount > 0 
      ? `Created a new ${newPost.type} titled "${newPost.title}" with ${optionsCount} poll option(s)`
      : `Created a new ${newPost.type} titled "${newPost.title}"`;

    await AuditLog.create({
      action: "CREATE",
      details,
      adminId: req.user.id
    });

    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating message", error: error.message });
  }
};

// photo video or assignments
exports.uploadMedia = async (req, res) => {
  try {
    let filesToProcess = [];
    if (req.files && req.files.length > 0) {
      filesToProcess = req.files;
    } else if (req.file) {
      filesToProcess = [req.file];
    }

    if (filesToProcess.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, type, tags, content } = req.body;

    // the url jo hamara student frontend will look for
    // If there's only one file, it can still be an array to support multi-images consistently
    const mediaUrls = filesToProcess.map(
      (file) => `/uploads/${type}s/${file.filename}`,
    );

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = typeof tags === "string" ? tags.split(",") : tags;
      }
    }

    const newPost = await BootcampPost.create({
      type,
      title,
      content: content || null,
      mediaUrl: mediaUrls,
      tags: parsedTags,
      createdBy: req.user.id, // abhi ke liye demo
    });

    await AuditLog.create({
      action: "CREATE",
      details: `Uploaded a new ${newPost.type} titled "${newPost.title}" with ${mediaUrls.length} file(s)`,
      adminId: req.user.id
    });

    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading media", error: error.message });
  }
};

// delete by id
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params; //get post id from url;
    const post = await BootcampPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await AuditLog.create({
      action: "DELETE",
      details: `Deleted ${post.type} titled "${post.title}"`,
      adminId: req.user.id
    });

    await post.destroy();
    res.json({ message: "deleted post" });
  } catch (error) {
    res.status(500).json({ message: "error: ", error: error.message });
  }
};

// update post ka logic idhr jaayega
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, pollOptions } = req.body;

    const post = await BootcampPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let changes = [];

    if (title !== undefined && post.title !== title) {
      changes.push(`Changed title from "${post.title}" to "${title}"`);
      post.title = title;
    }
    if (content !== undefined && post.content !== content) {
      changes.push(`Updated content`);
      post.content = content;
    }

    if (tags !== undefined) {
      let parsedTags = [];
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = typeof tags === "string" ? tags.split(",") : tags;
      }
      
      const oldTags = post.tags || [];
      if (JSON.stringify(oldTags) !== JSON.stringify(parsedTags)) {
        changes.push(`Updated tags from [${oldTags.join(', ')}] to [${parsedTags.join(', ')}]`);
        post.tags = parsedTags;
      }
    }

    if (pollOptions !== undefined) {
      let parsedOptions = [];
      try {
        parsedOptions = JSON.parse(pollOptions);
      } catch (e) {
        parsedOptions = pollOptions;
      }

      const oldOptions = post.pollOptions || [];
      if (JSON.stringify(oldOptions) !== JSON.stringify(parsedOptions)) {
        const added = parsedOptions.filter(o => !oldOptions.includes(o)).length;
        const removed = oldOptions.filter(o => !parsedOptions.includes(o)).length;
        
        if (added > 0 || removed > 0) {
           changes.push(`Updated poll options (+${added} added, -${removed} removed)`);
        } else {
           changes.push(`Edited poll options`);
        }
        post.pollOptions = parsedOptions;
      }
    }

    if (req.files && req.files.length > 0) {
      const mediaUrls = req.files.map(
        (file) => `/uploads/${post.type}s/${file.filename}`,
      );
      changes.push(`Uploaded ${req.files.length} new file(s)`);
      post.mediaUrl = mediaUrls;
    }

    await post.save();

    if (changes.length > 0) {
      const detailsString = `Edited ${post.type} (ID: ${post.id}):\n` + changes.map(c => `• ${c}`).join('\n');
      
      await AuditLog.create({
        action: "UPDATE",
        details: detailsString,
        adminId: req.user.id
      });
    }

    res.json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "error: ", error: error.message });
  }
};
