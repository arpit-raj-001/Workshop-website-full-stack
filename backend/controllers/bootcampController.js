const { BootcampPost, User } = require("../models");

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

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    if (tags !== undefined) {
      try {
        post.tags = JSON.parse(tags);
      } catch (e) {
        post.tags = typeof tags === "string" ? tags.split(",") : tags;
      }
    }

    if (pollOptions !== undefined) {
      try {
        post.pollOptions = JSON.parse(pollOptions);
      } catch (e) {
        post.pollOptions = pollOptions;
      }
    }

    if (req.files && req.files.length > 0) {
      const mediaUrls = req.files.map(
        (file) => `/uploads/${post.type}s/${file.filename}`,
      );
      post.mediaUrl = mediaUrls;
    }

    await post.save();

    res.json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "error: ", error: error.message });
  }
};
