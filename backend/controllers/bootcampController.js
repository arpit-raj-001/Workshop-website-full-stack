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

// message or pole creation

exports.createMessage = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const newPost = await BootcampPost.create({
      type: type || "message",
      title,
      content,
      createdBy: req.user.id,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating message", error: error.message });
  }
};

// 3. upload photo or media
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, type } = req.body;

    // the url frontend will look for later
    const mediaUrl = `/uploads/${type}s/${req.file.filename}`;

    const newPost = await BootcampPost.create({
      type,
      title,
      mediaUrl,
      createdBy: req.user.id,
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

// update (media update ka feauture baad me , abhi sirf text or poll)
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await BootcampPost.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //title chnage nhi kiya to pehle waala hi rkh lete
    post.title = title !== undefined ? title : post.title;
    post.content = content !== undefined ? content : post.content;
    await post.save();

    res.json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "error: ", error: error.message });
  }
};
