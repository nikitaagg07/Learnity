const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  assignmentTitle: { type: String, required: true },
  submittedFile: { type: String, required: true }, // Ensure this field is present
  remarks: { type: String, default: "" },
  grade: { type: String, default: "" },
  gradedBy: { type: String, default: "" } // If gradedBy is added
}, { timestamps: true });

const Submission = mongoose.model("Submission", SubmissionSchema);

module.exports = Submission;
