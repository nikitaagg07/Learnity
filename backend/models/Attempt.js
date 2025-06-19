// models/Attempt.js
/*const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  enrolledLearners: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', AttemptSchema);*/



/*const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Generic user field
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', attemptSchema);*/










/*const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
 // learner: { type: mongoose.Schema.Types.ObjectId, ref: "Learner", required: true },  // Reference Learner instead of User
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attempt', attemptSchema);*/




const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  //learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Learner', required: true },
  answers: [{ questionId: String, selectedOption: Number }],
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', attemptSchema);

