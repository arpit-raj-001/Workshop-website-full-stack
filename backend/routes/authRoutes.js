const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /auth/google
// asking google about profiule info
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

//GET /auth/google/callback

//google will redirect to our frontend , and then passport can verify the user and if verified snd to callback function from controller
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback,
);

// 3. GET /auth/me
// a route to check if token still valid
router.get("/me", auth, authController.getMe);

module.exports = router;
