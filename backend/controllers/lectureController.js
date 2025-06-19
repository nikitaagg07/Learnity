const Lecture = require("../models/Lecture");




const createLecture = async (req, res) => {
    try {
      console.log("Received Data:", req.body);
      const { topic, description, date, time } = req.body;
      const meetingLink = `https://meet.jit.si/${topic.replace(/\s+/g, "-")}-${Date.now()}`;
      const lecture = new Lecture({ topic, description, date, time, meetingLink });
      await lecture.save();
      console.log("Lecture Created:", lecture);
      res.status(201).json(lecture);
    } catch (err) {
      console.error("Error Creating Lecture:", err);
      res.status(500).json({ error: "Failed to create lecture", details: err.message });
    }
  };

// Fetch all lectures (No filtering by creator)
const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find();
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch lectures" });
  }
};

module.exports = { createLecture, getAllLectures };
