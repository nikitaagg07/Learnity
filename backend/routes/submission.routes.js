const express = require("express");
const multer = require("multer");

const {
  uploadSubmission,
  getSubmissions,
  getSubmissionById,
  deleteSubmission,
  addRemarkToSubmission,
  getGradedSubmissions, // ✅ New controllers
} = require("../controllers/submission.controller");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Routes
router.post("/submit", upload.single("file"), uploadSubmission);
router.get("/", getSubmissions);
router.get("/graded", getGradedSubmissions);

router.get("/:id", getSubmissionById);
router.delete("/:id", deleteSubmission);

// ✅ New routes
router.patch("/remark/:id", addRemarkToSubmission);

module.exports = router;
