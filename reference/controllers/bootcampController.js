const { BootcampPost } = require('../models');
const fs = require('fs');
const path = require('path');

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Photo file is required' });

    const post = await BootcampPost.create({
      type: 'photo',
      title: req.body.title || null,
      mediaUrl: `/uploads/photos/${req.file.filename}`,
      createdBy: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Video file is required' });

    const post = await BootcampPost.create({
      type: 'video',
      title: req.body.title || null,
      mediaUrl: `/uploads/videos/${req.file.filename}`,
      createdBy: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Message content is required' });

    const post = await BootcampPost.create({
      type: 'message',
      title: title || null,
      content,
      createdBy: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: list everything, or filter with ?type=photo / video / message
exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.type) where.type = req.query.type;

    const posts = await BootcampPost.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const post = await BootcampPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await BootcampPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });

    const { title, content } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await BootcampPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });

    if (post.mediaUrl) {
      const filePath = path.join(__dirname, '..', post.mediaUrl);
      fs.unlink(filePath, () => {}); // best-effort cleanup, ignore errors
    }

    await post.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
