const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// GET /api/users/admins
router.get("/admins", auth, userController.getActiveAdmins);

// GET /api/users/profile
router.get("/profile", auth, userController.getProfile);

// PUT /api/users/profile
router.put("/profile", auth, upload.single("photo"), userController.updateProfile);

module.exports = router;
