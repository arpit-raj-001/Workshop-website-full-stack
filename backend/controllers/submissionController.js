const {
  AssignmentSubmission,
  BootcampPost,
  User,
  Notification,
  AuditLog,
} = require("../models");

//handle the srtudent assignment submission
exports.submitAssignment = async (req, res) => {
  try {
    const { postId } = req.body;
    const studentId = req.user.id; //auth middleware

    if (!req.file) {
      return res
        .status(400)
        .json({
          message:
            "error while uploading , upload while make sure that file is less than 5mb and uploaded",
        });
    }

    const fileUrl = `/studentuploads/${req.file.filename}`;

    //post must exist and be an assignment type
    const post = await BootcampPost.findByPk(postId);
    if (!post || post.type !== "assignment") {
      return res.status(404).json({ message: "Assignment not found." });
    }

    //duplicate submission not allowed
    const existingSubmission = await AssignmentSubmission.findOne({
      where: { postId, studentId },
    });

    let submission;

    if (existingSubmission) {
      //update with latest submitted
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.status = "submitted";
      existingSubmission.submittedAt = new Date();
      await existingSubmission.save();
      submission = existingSubmission;
    } else {
      submission = await AssignmentSubmission.create({
        studentId,
        postId,
        fileUrl,
        status: "submitted",
      });
    }

    res.status(201).json({ message: "submitted", submission });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};

//admin controller to see all submissions
exports.getAllSubmissions = async (req, res) => {
  try {
    const { postId, status } = req.query;
    const whereClause = {};
    if (postId) whereClause.postId = postId;
    if (status) whereClause.status = status;

    const submissions = await AssignmentSubmission.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ["name", "email", "avatar"] },
        {
          model: BootcampPost,
          attributes: ["title", "assignmentId", "deadline"],
        },
      ],
      order: [["submittedAt", "DESC"]], //newest first
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "eror", error: error.message });
  }
};

//grading by admin
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { score, adminComments } = req.body;
    const adminId = req.user.id;

    const submission = await AssignmentSubmission.findByPk(submissionId, {
      include: [{ model: BootcampPost }], //toget post info
    });

    if (!submission) {
      return res.status(404).json({ message: "not found submission" });
    }
    //grading
    submission.score = score;
    submission.adminComments = adminComments;
    submission.status = "graded";
    submission.gradedAt = new Date();
    await submission.save();

    //submission
    await AuditLog.create({
      action: "UPDATE",
      details: `Graded submission ID ${submissionId} with score ${score}`,
      adminId,
    });

    //give notification
    await Notification.create({
      userId: submission.studentId,
      type: "assignment_graded",
      message: `Your assignment "${submission.BootcampPost.title}" has been graded! you have scored: ${score}`,
      linkUrl: `/dashboard`,
    });

    res.json({ message: "graded", submission });
  } catch (error) {
    res.status(500).json({ message: "error", error: error.message });
  }
};
