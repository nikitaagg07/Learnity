// controllers/quizController.js
/*const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res) => {
  try {
    if (req.user.role !== "creator") {
      return res.status(403).json({ message: "Only creators can create quizzes." });
    }

    const { title, questions, duration } = req.body;
    if (!title || !questions?.length || !duration) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const quiz = new Quiz({
      title,
      questions,
      creator: req.user.userId,
      duration
    });
    
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully!", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("creator", "name email");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("creator", "name email");
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });

    if (quiz.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to update this quiz." });
    }

    Object.assign(quiz, req.body);
    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully!", quiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });

    if (quiz.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this quiz." });
    }

    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error: error.message });
  }
};*/




/*const Quiz = require("../models/Quiz"); // Ensure the correct model path

const createQuiz = async (req, res) => {
  try {
    const { title, questions, duration } = req.body;
    const newQuiz = await Quiz.create({ title, questions, duration });
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

module.exports = { createQuiz };*/





/*const Quiz = require("../models/Quiz");

// Create Quiz (No restriction on creator)
const createQuiz = async (req, res) => {
  try {
    const { title, questions, duration } = req.body;
    const newQuiz = await Quiz.create({ title, questions, duration });

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

// Get All Quizzes (Anyone can access)



const getAllQuizzes = async (req, res) => {
  console.log("🔍 GET /api/quiz/all - Request received");  // Debugging
  try {
    const quizzes = await Quiz.find();
    console.log("✅ Quizzes fetched:", quizzes); // Debugging
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};



// Edit Quiz (Anyone can edit)
const editQuiz = async (req, res) => {
  try {
    const { title, questions, duration } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { title, questions, duration },
      { new: true }
    );

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error });
  }
};

// Delete Quiz (Anyone can delete)
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};
module.exports = { createQuiz, getAllQuizzes, getQuizById,editQuiz, deleteQuiz };*/




const Quiz = require("../models/Quiz");
const axios = require("axios");
require("dotenv").config();


    const createQuiz = async (req, res) => {
      try {
        const { title, questions, duration } = req.body;
    
        const processedQuestions = questions.map(q => {
          if (q.isCodingQuestion) {
            return {
              ...q,
              correctAnswer: undefined  // Remove for coding questions
            };
          } else {
            return {
              ...q,
              language: undefined,
              starterCode: undefined,
              codingTestCases: undefined,
              expectedOutput: undefined,
            };
          }
        });
    
        const newQuiz = await Quiz.create({ title, questions: processedQuestions, duration });
    
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

// Get All Quizzes (Anyone can access)



const getAllQuizzes = async (req, res) => {
  console.log("🔍 GET /api/quiz/all - Request received");  // Debugging
  try {
    const quizzes = await Quiz.find();
    console.log("✅ Quizzes fetched:", quizzes); // Debugging
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};



// Edit Quiz (Anyone can edit)
const editQuiz = async (req, res) => {
  try {
    const { title, questions, duration } = req.body;
    

      // Optional Validation - Ensure coding questions have required fields
      for (const question of questions) {
          if (question.isCodingQuestion) {
              if (!question.language || !question.starterCode || !Array.isArray(question.codingTestCases)) {
                  return res.status(400).json({ message: `Coding question is missing required fields.` });
              }
          }
      }
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { title, questions, duration },
      { new: true }
    );

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error });
  }
};

// Delete Quiz (Anyone can delete)
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};

const deleteQuestionFromQuiz = async (req, res) => {
  const { quizId, questionId } = req.params;

  try {
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }

      // Filter out the question to be deleted
      quiz.questions = quiz.questions.filter(
          (q) => q._id.toString() !== questionId
      );

      await quiz.save();

      res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
};


const runCode = async (req, res) => {
  const { language, code } = req.body;

  const languageMapping = {
     "javascript": 63,
      "python3": 71,
      "cpp17": 54
  };

  if (!languageMapping[language]) {
      return res.status(400).json({ error: "Unsupported language" });
  }

  try {
      const response = await axios.post(process.env.JUDGE0_API_URL + "?base64_encoded=false&wait=false", {
          source_code: code,
          language_id: languageMapping[language],
          stdin: "",
      }, {
          headers: {
              //"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key":  process.env.JUDGE0_API_KEY,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
      });

      const token = response.data.token;
      console.log("Generated Token:", token);
      setTimeout(async () => {
          const result = await axios.get(`${process.env.JUDGE0_API_URL}/${token}?base64_encoded=false`, {
              headers: {
                  //"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                  "X-RapidAPI-Key":  process.env.JUDGE0_API_KEY,
                  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
              }
          });

          res.json(result.data);
      }, 5000); // Wait for execution
  } catch (error) {
      console.error("Judge0 API error:", error);
      res.status(500).json({ error: "Error executing code." });
  }
  
};






module.exports = { createQuiz, getAllQuizzes, getQuizById,editQuiz, deleteQuiz ,deleteQuestionFromQuiz, runCode};



