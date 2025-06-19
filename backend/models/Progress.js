// const mongoose = require("mongoose");

// const progressSchema = new mongoose.Schema({
//   learner: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },
//   course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//   completedLessons: [{ type: Number }], // Stores lesson indices
//   progressPercentage: { type: Number, default: 0 },
// }, { timestamps: true });

// module.exports = mongoose.model("Progress", progressSchema);

// models/Progress.js
// This model is used by the advanced recommendations engine
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  learnerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Learner',
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{ type: Number }],
  timeSpent: {
    type: Number,
    default: 0  // in seconds
  }
}, { timestamps: true });

// Compound index to ensure a user can only have one progress record per course
progressSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;