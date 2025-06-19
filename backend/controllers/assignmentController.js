// import Assignment from "../models/assignment.model.js";
// import path from "path";
// import fs from "fs";

// const uploadFolder = path.join(path.resolve(), "uploads/");

// // ✅ Ensure "uploads/" folder exists
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder, { recursive: true });
// }

// // ✅ Create Assignment
// export const createAssignment = async (req, res) => {
//   try {
//     const { title, section, totalMarks, date, description, maxWords, instructions, cutOffDate, enableResubmission } = req.body;

//     if (!title || !section || !totalMarks || !date) {
//       return res.status(400).json({ message: "❌ Missing required fields: Title, Section, Total Marks, or Date" });
//     }

//     const supportFiles = req.files ? req.files.map(file => file.filename) : [];

//     const assignment = new Assignment({
//       title,
//       section,
//       totalMarks,
//       date: new Date(date),
//       cutOffDate: cutOffDate ? new Date(cutOffDate) : null,
//       description: description || "",
//       maxWords: maxWords ? Number(maxWords) : null,
//       instructions: instructions || "",
//       enableResubmission: enableResubmission === "true" || enableResubmission === true,
//       supportFiles,
//     });

//     await assignment.save();
//     res.status(201).json({ message: "✅ Assignment created successfully!", assignment });
//   } catch (error) {
//     console.error("❌ Error creating assignment:", error);
//     res.status(500).json({ message: "❌ Server error while creating assignment", error });
//   }
// };

// // ✅ Get All Assignments
// export const getAllAssignments = async (req, res) => {
//   try {
//     const assignments = await Assignment.find();
//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error("❌ Error fetching assignments:", error);
//     res.status(500).json({ message: "❌ Server error while fetching assignments", error });
//   }
// };

// // ✅ Get Latest Assignment
// export const getLatestAssignment = async (req, res) => {
//   try {
//     const latestAssignment = await Assignment.findOne().sort({ createdAt: -1 });

//     if (!latestAssignment) {
//       return res.status(404).json({ message: "❌ No assignments available" });
//     }

//     res.json(latestAssignment);
//   } catch (error) {
//     console.error("❌ Error fetching latest assignment:", error);
//     res.status(500).json({ message: "❌ Server error while fetching latest assignment", error });
//   }
// };

// // ✅ Serve Uploaded Files
// export const serveUploadedFile = (req, res) => {
//   const filePath = path.join(uploadFolder, req.params.filename);
//   if (fs.existsSync(filePath)) {
//     res.sendFile(filePath);
//   } else {
//     res.status(404).json({ message: "❌ File not found" });
//   }
// };

const Assignment = require("../models/assignment.model.js");
const path = require("path");
const fs = require("fs");

const uploadFolder = path.join(path.resolve(), "uploads/");

// ✅ Ensure "uploads/" folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// ✅ Create Assignment
const createAssignment = async (req, res) => {
  try {
    const { title, section, totalMarks, date, description, maxWords, instructions, cutOffDate, enableResubmission } = req.body;

    if (!title || !section || !totalMarks || !date) {
      return res.status(400).json({ message: "❌ Missing required fields: Title, Section, Total Marks, or Date" });
    }

    const supportFiles = req.files ? req.files.map(file => file.filename) : [];

    const assignment = new Assignment({
      title,
      section,
      totalMarks,
      date: new Date(date),
      cutOffDate: cutOffDate ? new Date(cutOffDate) : null,
      description: description || "",
      maxWords: maxWords ? Number(maxWords) : null,
      instructions: instructions || "",
      enableResubmission: enableResubmission === "true" || enableResubmission === true,
      supportFiles,
    });

    await assignment.save();
    res.status(201).json({ message: "✅ Assignment created successfully!", assignment });
  } catch (error) {
    console.error("❌ Error creating assignment:", error);
    res.status(500).json({ message: "❌ Server error while creating assignment", error });
  }
};

// ✅ Get All Assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    console.error("❌ Error fetching assignments:", error);
    res.status(500).json({ message: "❌ Server error while fetching assignments", error });
  }
};

// ✅ Get Latest Assignment
const getLatestAssignment = async (req, res) => {
  try {
    const latestAssignment = await Assignment.findOne().sort({ createdAt: -1 });

    if (!latestAssignment) {
      return res.status(404).json({ message: "❌ No assignments available" });
    }

    res.json(latestAssignment);
  } catch (error) {
    console.error("❌ Error fetching latest assignment:", error);
    res.status(500).json({ message: "❌ Server error while fetching latest assignment", error });
  }
};

// ✅ Serve Uploaded Files
const serveUploadedFile = (req, res) => {
  const filePath = path.join(uploadFolder, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "❌ File not found" });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getLatestAssignment,
  serveUploadedFile
};
