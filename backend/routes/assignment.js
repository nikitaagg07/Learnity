// import express from "express";
// import multer from "multer";
// import path from "path";
// import { createAssignment, getAllAssignments, getLatestAssignment, serveUploadedFile } from "../controllers/assignmentController.js";

// const router = express.Router();
// const uploadFolder = path.join(path.resolve(), "uploads/");

// // ✅ Ensure "uploads/" folder exists
// import fs from "fs";
// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder, { recursive: true });
// }

// // ✅ Multer Storage Configuration (now inside routes)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadFolder),
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
// });

// const upload = multer({ storage });

// router.post("/create", upload.array("supportFiles", 5), createAssignment);
// router.get("/all", getAllAssignments);
// router.get("/latest", getLatestAssignment);
// router.get("/files/:filename", serveUploadedFile);

// export default router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { 
  createAssignment, 
  getAllAssignments, 
  getLatestAssignment, 
  serveUploadedFile 
} = require("../controllers/assignmentController");

const router = express.Router();
const uploadFolder = path.join(path.resolve(), "uploads/");

// ✅ Ensure "uploads/" folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post("/create", upload.array("supportFiles", 5), createAssignment);
router.get("/all", getAllAssignments);
router.get("/latest", getLatestAssignment);
router.get("/files/:filename", serveUploadedFile);

module.exports = router;
