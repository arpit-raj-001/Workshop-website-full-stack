const jwt = require("jsonwebtoken");

//sign in ke baad waala function , jwt token signing wagera
exports.googleCallback = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "failed" });
  }

  //30din ki expiry rkhi he filhaal , subject to change
  const token = jwt.sign(
    { id: req.user.id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );

  //redirect to react app , and pass token in url
  res.redirect(`http://localhost:5173/login?token=${token}`);
};

exports.getMe = async (req, res) => {
  try {
    const { User } = require("../models");
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "You are authenticated",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};
