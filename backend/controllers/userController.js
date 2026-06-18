const { User, BootcampPost, Doubt } = require("../models");
const { Op } = require("sequelize");

exports.getActiveAdmins = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);

    const admins = await User.findAll({
      where: {
        role: "admin",
        lastLogin: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
      attributes: ["id", "name", "email", "avatar", "lastLogin"],
      include: [
        {
          model: BootcampPost,
          attributes: ["id"],
        },
        {
          model: Doubt,
          as: "AnsweredDoubts",
          attributes: ["id", "question", "answer", "status", "updatedAt"],
        },
      ],
    });

    const formattedAdmins = admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      avatar: admin.avatar,
      lastLogin: admin.lastLogin,
      postsCreated: admin.BootcampPosts ? admin.BootcampPosts.length : 0,
      doubtsAnswered: admin.AnsweredDoubts ? admin.AnsweredDoubts.length : 0,
      doubts: admin.AnsweredDoubts
        ? admin.AnsweredDoubts.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          ).map((d) => ({
            q: d.question,
            a: d.answer,
            status: d.status,
          }))
        : [],
    }));

    res.json(formattedAdmins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const admin = await User.findByPk(req.user.id, {
      include: [
        { model: BootcampPost, attributes: ["id"] },
        { model: Doubt, as: "AnsweredDoubts", attributes: ["id"] },
      ],
    });

    if (!admin) return res.status(404).json({ message: "Profile not found" });

    res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      avatar: admin.avatar,
      bio: admin.bio,
      postsCreated: admin.BootcampPosts ? admin.BootcampPosts.length : 0,
      doubtsAnswered: admin.AnsweredDoubts ? admin.AnsweredDoubts.length : 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const admin = await User.findByPk(req.user.id);

    if (!admin) return res.status(404).json({ message: "Profile not found" });

    if (name) admin.name = name;
    if (bio !== undefined) admin.bio = bio; // Allow empty

    if (req.file) {
      admin.avatar = `http://localhost:5000/uploads/photos/${req.file.filename}`;
    }

    await admin.save();

    res.json({ message: "Profile updated successfully", admin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};
