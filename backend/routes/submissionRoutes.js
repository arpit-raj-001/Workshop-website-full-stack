const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const studentUpload = require("../middleware/studentUpload");
const submissionController = require("../controllers/submissionController");

// ==========================================
// STUDENT ROUTES
// ==========================================

// POST /api/submissions
// Student uploads a PDF for an assignment (requires auth)
// We look for a field named 'pdf' in the form-data
router.post(
  "/",
  auth,
  studentUpload.single("pdf"), 
  submissionController.submitAssignment
);

// ==========================================
// ADMIN ROUTES
// ==========================================

// GET /api/submissions
// Admin fetches all submissions (requires admin auth)
router.get("/", auth, isAdmin, submissionController.getAllSubmissions);

// PUT /api/submissions/:submissionId/grade
// Admin grades a specific submission (requires admin auth)
router.put(
  "/:submissionId/grade",
  auth,
  isAdmin,
  submissionController.gradeSubmission
);

module.exports = router;
