const express = require("express");
const router = express.Router();
const { createLecture, getAllLectures } = require("../controllers/lectureController");

// Create a lecture
router.post("/create", createLecture);

// Get all lectures
router.get("/", getAllLectures);

module.exports = router;