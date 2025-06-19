
const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  topic: String,
  description: String,
  date: String,
  time: String,
  status: { type: String, default: "pending" },  // Added status field
  meetingLink: String,
  image: String, // ✅ New field for image URL or base64
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

});

module.exports = mongoose.model("Lecture", LectureSchema);

