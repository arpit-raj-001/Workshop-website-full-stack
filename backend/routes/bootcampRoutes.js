const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/upload");
const bootcampController = require("../controllers/bootcampController");

// GET /api/bootcamp
router.get("/", bootcampController.getAllPosts);
router.post("/message", auth, isAdmin, bootcampController.createMessage);

// POST /api/bootcamp/photo
router.post(
  "/photo",
  auth,
  isAdmin,
  upload.single("photo"),
  bootcampController.uploadMedia,
);

// POST /api/bootcamp/video
router.post(
  "/video",
  auth,
  isAdmin,
  upload.single("video"),
  bootcampController.uploadMedia,
);

// PUT /api/bootcamp/:id
router.put("/:id", auth, isAdmin, bootcampController.updatePost);

// DELETE /api/bootcamp/:id
router.delete("/:id", auth, isAdmin, bootcampController.deletePost);
module.exports = router;
