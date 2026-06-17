// Use this after the auth middleware on any route that only
// admins should be allowed to use (uploading, editing, deleting).
module.exports = function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
};
