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

  res.json({
    message: "Login successful",
    token: token,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
    },
  });
};

exports.getMe = (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
};
