// models/Quiz.js
/*const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: Number,
  }],
});

module.exports = mongoose.model('Quiz', quizSchema);*/
// models/Quiz.js
/*const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: Number,
  }],
  duration: Number, // Adding duration field
});

module.exports = mongoose.model('Quiz', quizSchema);*/





/*const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  enrolledLearners: { type: mongoose.Schema.Types.ObjectId, ref: 'Learner' },
  questions: [{
    questionText: String,
    options: [String], // Only for MCQs
    correctAnswer: Number, // Only for MCQs
    isCodingQuestion: { type: Boolean, default: false }, // New field for coding questions
    codingTestCases: [{
      input: String,
      expectedOutput: String
    }] // Test cases for coding questions
  }],
  duration: Number,
});

module.exports = mongoose.model('Quiz', quizSchema);*/





/*const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  enrolledLearners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Learner' }],
  questions: [{
    questionText: String,
    options: [String], 
    correctAnswer: Number, 
    isCodingQuestion: { type: Boolean, default: false }, 
    codingTestCases: [{
      input: String,
      expectedOutput: String
    }],
    timeLimit: Number,  // time in seconds for each question
    responses: [{
      learnerName: String,
      selectedOption: Number,
    }]
  }],
 // duration: Number,
});

module.exports = mongoose.model('Quiz', quizSchema);*/


const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  enrolledLearners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Learner' }],
  questions: [{
    questionText: String,
    options: [String], 
    correctAnswer: Number, // For MCQs
    isCodingQuestion: { type: Boolean, default: false }, 
    language: { type: String },
    starterCode: { type: String },
    codingTestCases: [{ input: String, expectedOutput: String }],
    expectedOutput: String,  // For Coding Questions
    timeLimit: Number,

    responses: [{
      learnerName: String,
      selectedOption: Number,
    }]
  }],
  //duration: Number,
});

module.exports = mongoose.model('Quiz', quizSchema);





