const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "userType" }, // Dynamic reference
  userType: { type: String, enum: ["Learner", "Instructor"], required: true }, // Determines the user role
  category: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  relatedCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Related course if applicable
  file: { type: String }, // File path for uploaded attachments
  status: { type: String, default: "Pending", enum: ["Pending", "In Progress", "Closed"] }, // Track request status
  createdAt: { type: Date, default: Date.now },
});

const Support = mongoose.model("Support", supportRequestSchema);
module.exports = Support;
