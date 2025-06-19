// import Submission from "../models/submission.model.js";

// // ✅ Upload Submission
// export const uploadSubmission = async (req, res) => {
//   try {
//     console.log("📥 Incoming submission:", req.body);

//     if (!req.file) {
//       console.error("❌ No file uploaded");
//       return res.status(400).json({ message: "❌ No file uploaded" });
//     }

//     const { studentName, assignmentTitle } = req.body;

//     if (!studentName || !assignmentTitle) {
//       console.error("❌ Missing required fields:", { studentName, assignmentTitle });
//       return res.status(400).json({ message: "❌ Missing required fields" });
//     }

//     const newSubmission = new Submission({
//       studentName,
//       assignmentTitle,
//       submittedFile: req.file.filename,
//     });

//     await newSubmission.save();
//     console.log("✅ Submission saved successfully:", newSubmission);

//     res.status(201).json({ message: "✅ Submission successful!", submission: newSubmission });
//   } catch (error) {
//     console.error("❌ Submission error:", error);
//     res.status(500).json({ message: "❌ Submission failed", error: error.message });
//   }
// };

// // ✅ Get All Submissions
// export const getSubmissions = async (req, res) => {
//   try {
//     const submissions = await Submission.find();
//     res.status(200).json(submissions);
//   } catch (error) {
//     console.error("❌ Error fetching submissions:", error);
//     res.status(500).json({ message: "❌ Failed to fetch submissions", error: error.message });
//   }
// };

// // ✅ Get Submission by ID
// export const getSubmissionById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const submission = await Submission.findById(id);
//     if (!submission) {
//       return res.status(404).json({ message: "❌ Submission not found" });
//     }
//     res.status(200).json(submission);
//   } catch (error) {
//     console.error("❌ Error fetching submission:", error);
//     res.status(500).json({ message: "❌ Failed to fetch submission", error: error.message });
//   }
// };

// // ✅ Delete Submission
// export const deleteSubmission = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedSubmission = await Submission.findByIdAndDelete(id);
//     if (!deletedSubmission) {
//       return res.status(404).json({ message: "❌ Submission not found" });
//     }
//     res.status(200).json({ message: "✅ Submission deleted successfully" });
//   } catch (error) {
//     console.error("❌ Error deleting submission:", error);
//     res.status(500).json({ message: "❌ Failed to delete submission", error: error.message });
//   }
// };
const Submission = require("../models/submission.model");

// ✅ Upload Submission
const uploadSubmission = async (req, res) => {
  try {
    console.log("📥 Incoming submission:", req.body);

    if (!req.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ message: "❌ No file uploaded" });
    }

    const { studentName, assignmentTitle } = req.body;

    if (!studentName || !assignmentTitle) {
      console.error("❌ Missing required fields:", { studentName, assignmentTitle });
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const newSubmission = new Submission({
      studentName,
      assignmentTitle,
      submittedFile: req.file.filename,

    });

    await newSubmission.save();
    console.log("✅ Submission saved successfully:", newSubmission);
    res.status(201).json({ message: "✅ Submission successful!", submission: newSubmission });
  } catch (error) {
    console.error("❌ Submission error:", error);
    res.status(500).json({ message: "❌ Submission failed", error: error.message });
  }
};

// ✅ Get all submissions
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    res.status(500).json({ message: "❌ Failed to fetch submissions", error: error.message });
  }
};

// ✅ Get submission by ID
const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "❌ Submission not found" });
    }
    res.status(200).json(submission);
  } catch (error) {
    console.error("❌ Error fetching submission:", error);
    res.status(500).json({ message: "❌ Failed to fetch submission", error: error.message });
  }
};

// ✅ Delete submission
const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Submission.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "❌ Submission not found" });
    }
    res.status(200).json({ message: "✅ Submission deleted successfully" });
  } catch (error) {
    console.error("❌ Failed to delete submission:", error);
    res.status(500).json({ message: "❌ Failed to delete submission", error: error.message });
  }
};

// ✅ Add remarks and grade
const addRemarkToSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, grade, gradedBy } = req.body;

    const updatedSubmission = await Submission.findByIdAndUpdate(
      id,
      { remarks, grade, gradedBy },
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "❌ Submission not found" });
    }

    res.status(200).json({ message: "✅ Remark updated", submission: updatedSubmission });
  } catch (error) {
    console.error("❌ Error adding remark:", error);
    res.status(500).json({ message: "❌ Failed to add remark", error: error.message });
  }
};

const getGradedSubmissions = async (req, res) => {
  try {
    console.log("📥 Received request for graded submissions");
    const gradedSubmissions = await Submission.find({ grade: { $nin: [null, ""] } });
    console.log("✅ Found graded submissions:", gradedSubmissions.length);
    res.status(200).json(gradedSubmissions);
  } catch (error) {
    console.error("❌ Error fetching graded submissions:", error);
    res.status(500).json({ 
      message: "❌ Failed to fetch graded submissions", 
      error: error.message,
      stack: error.stack  // <- helpful!
    });
  }
};




module.exports = { getGradedSubmissions, addRemarkToSubmission, deleteSubmission,uploadSubmission,getSubmissions,getSubmissionById };
