/*const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

// ✅ Submit a Quiz Attempt (No role restriction)
exports.submitAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += 1;
        correctAnswers += 1;
      } else {
        wrongAnswers += 1;
      }
    });

    const attempt = new Attempt({
      user: req.user.id, // Any authenticated user can attempt now
      quiz: quizId,
      score,
      correctAnswers,
      wrongAnswers,
    });

    await attempt.save();

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      score,
      correctAnswers,
      wrongAnswers,
      attemptId: attempt._id,
    });
  } catch (error) {
    console.error('❌ Error submitting attempt:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get Attempt Details by ID
exports.getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId).populate('quiz', 'title');

    if (!attempt) {
      console.log("❌ Attempt not found for ID:", req.params.attemptId);
      return res.status(404).json({ message: 'Attempt not found' });
    }

    console.log('✅ Found attempt:', attempt);
    res.json(attempt);
  } catch (error) {
    console.error('❌ Server Error fetching attempt:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};*/





/*const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");
const User = require("../models/User");  // Ensure you have this

const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const userId = req.user.id;  // Assuming `protect` middleware sets req.user

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        let correctAnswers = 0;

        quiz.questions.forEach((question, index) => {
            if (!question.isCodingQuestion) {
                // Check only MCQ type questions
                if (parseInt(answers[index]) === question.correctAnswer) {
                    correctAnswers++;
                }
            }
        });

        const score = (correctAnswers / quiz.questions.length) * 100;

        const attempt = new Attempt({
            user: userId,
            quiz: quizId,
            score,
            correctAnswers,
            wrongAnswers: quiz.questions.length - correctAnswers,
        });

        await attempt.save();

        res.status(201).json({ message: "Quiz submitted successfully", attemptId: attempt._id });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAttemptById = async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate('quiz');
        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }
        res.status(200).json(attempt);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attempt", error });
    }
};

module.exports = { submitQuiz, getAttemptById };*/










/*const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");

const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;  

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        let correctAnswers = 0;

        quiz.questions.forEach((question, index) => {
            if (!question.isCodingQuestion) {
                // Check only MCQ type questions
                if (parseInt(answers[index]) === question.correctAnswer) {
                    correctAnswers++;
                }
            }
        });

        const score = (correctAnswers / quiz.questions.length) * 100;

        const attempt = new Attempt({
            //learner: learnerId,  // Use learnerId instead of userId
            quiz: quizId,
            score,
            correctAnswers,
            wrongAnswers: quiz.questions.length - correctAnswers,
        });

        await attempt.save();

        res.status(201).json({ message: "Quiz submitted successfully", attemptId: attempt._id });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAttemptById = async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.attemptId).populate('quiz');
        if (!attempt) {
            return res.status(404).json({ message: "Attempt not found" });
        }
        res.status(200).json(attempt);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attempt", error });
    }
};

module.exports = { submitQuiz, getAttemptById };*/


const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
exports.createAttempt = async (req, res) => {
  try {
    console.log("Request received at /api/attempt"); // Debug log
    console.log("Request body:", req.body); // Check if quizId and answers are received

    const { quizId, answers } = req.body;
    if (!quizId || !answers) {
      return res.status(400).json({ message: "quizId or answers missing" });
    }

    // Fetch the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Invalid data format: answers should be an array",
        receivedType: typeof answers
      });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;

    answers.forEach(({ questionId, selectedOption }) => {
      const questionIndex = parseInt(questionId, 10); // Convert index string to number

      if (!isNaN(questionIndex) && quiz.questions[questionIndex]) {
        const question = quiz.questions[questionIndex];
        if (!question.isCodingQuestion && question.correctAnswer === selectedOption) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      }
    });

    const score = (correctAnswers / quiz.questions.length) * 100;

    const attempt = new Attempt({
      quizId,
      answers,
      correctAnswers,
      wrongAnswers,
      score
    });

    await attempt.save()
   // console.log("✅ Attempt saved successfully:", attempt);
   .then(doc => console.log("Saved Attempt:", doc))
   .catch(err => console.error("Save Error:", err));
    //res.status(201).json({ message: "Attempt saved successfully", attempt });
    res.status(201).json({ message: "Attempt saved successfully", attemptId: attempt._id });

  } catch (error) {
    console.error("❌ Error saving attempt:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// Get attempts by learner
exports.getAttemptsByLearner = async (req, res) => {
  try {
    //const learnerId = req.user.id;
    const attempts = await Attempt.find({ learnerId }).populate('quizId', 'title');
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts', error: error.message });
  }
};

// Get attempt details by ID
exports.getAttemptById = async (req, res) => {
  try {
    //const { id } = req.params;
    const { attemptId } = req.params; // Corrected ✅
    console.log("Fetching attempt with ID:", attemptId);
    const attempt = await Attempt.findById(attemptId);//.populate('quizId', 'title');
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });

    res.status(200).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempt', error: error.message });
  }
};

// Get all attempts for a quiz
exports.getAttemptsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const attempts = await Attempt.find({ quizId }).populate('name');
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempts', error: error.message });
  }
};


