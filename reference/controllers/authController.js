const jwt = require('jsonwebtoken');

// Called after Google confirms the user's identity.
// We issue our own JWT so the rest of the API can stay stateless
// (no server-side sessions needed) — perfect for testing in Postman.
exports.googleCallback = (req, res) => {
  const user = req.user;

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

// Simple "who am I" endpoint to confirm a token works.
exports.me = (req, res) => {
  res.json({ user: req.user });
};
