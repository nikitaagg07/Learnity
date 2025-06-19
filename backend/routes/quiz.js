// // routes/quiz.js
// /*const express = require('express');
// const jwt = require('jsonwebtoken');
// const Quiz = require('../models/Quiz');
// const Attempt = require('../models/Attempt');
// const User = require('../models/User');

// const router = express.Router();

// // Middleware to check if the user is a creator
// const isCreator = (req, res, next) => {
//   const { role } = req.user;
//   if (role !== 'creator') return res.status(403).json({ message: 'Access denied' });
//   next();
// };

// // Create Quiz
// router.post('/create', isCreator, async (req, res) => {
//   const { title, questions } = req.body;
//   try {
//     const quiz = new Quiz({ title, questions, creator: req.user.userId });
//     await quiz.save();
//     res.status(201).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating quiz' });
//   }
// });

// // Get All Quizzes (for learners)
// router.get('/', async (req, res) => {
//   try {
//     const quizzes = await Quiz.find();
//     res.status(200).json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quizzes' });
//   }
// });

// // Attempt Quiz
// router.post('/attempt/:quizId', async (req, res) => {
//   const { quizId } = req.params;
//   const { answers } = req.body; // answers as an array of answer indexes
//   try {
//     const quiz = await Quiz.findById(quizId);
//     const score = quiz.questions.reduce((total, question, index) => {
//       return total + (question.correctAnswer === answers[index] ? 1 : 0);
//     }, 0);

//     const attempt = new Attempt({
//       quizId,
//       learnerId: req.user.userId,
//       answers,
//       score,
//     });

//     await attempt.save();
//     res.status(200).json({ score, totalQuestions: quiz.questions.length });
//   } catch (error) {
//     res.status(500).json({ message: 'Error attempting quiz' });
//   }
// });

// module.exports = router;*/

// // routes/quiz.js
// /*const express = require('express');
// const jwt = require('jsonwebtoken');
// const Quiz = require('../models/Quiz');
// const User = require('../models/User');
// const Attempt = require('../models/Attempt');
// //const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

// const router = express.Router();

// // Middleware to check if the user is a creator
// const isCreator = (req, res, next) => {
//   const { role } = req.user;
//   if (role !== 'creator') return res.status(403).json({ message: 'Access denied' });
//   next();
// };

// // Create Quiz
// //const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

// /*router.post('/create', authMiddleware, isCreator, async (req, res) => {
//   const { title, questions, duration } = req.body;
//   try {
//     const quiz = new Quiz({ title, questions, creator: req.user.userId, duration });
//     await quiz.save();
//     res.status(201).json(quiz);
//   } 
//   catch (error) {
//     console.error(error); // Log the error to the console
//     res.status(500).json({ message: 'Error creating quiz', error: error.message });
//   }
  
// });*/

// /*router.post('/create',  isCreator, async (req, res) => {
//   console.log('Authenticated user:', req.user); // Log the user data to check if it's populated
//   const { title, questions, duration } = req.body;
//   if (!title || !questions || !duration) {
//     return res.status(400).json({ message: 'Title, questions, and duration are required' });
//   }
//   try {
//     const quiz = new Quiz({ title, questions, creator: req.user.userId, duration });
//     await quiz.save();
//     res.status(201).json(quiz);
//   } catch (error) {
//     console.error(error); // Log the error for better debugging
//     res.status(500).json({ message: 'Error creating quiz', error: error.message });
//   }
// });


// /*router.post('/create', isCreator, async (req, res) => {
//   const { title, questions, duration } = req.body; // Added duration to request body
//   try {
//     const quiz = new Quiz({ title, questions, creator: req.user.userId, duration });
//     await quiz.save();
//     res.status(201).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating quiz' });
//   }
// });*/

// // Get All Quizzes by Creator (for creator dashboard)
// /*router.get('/creator', isCreator, async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({ creator: req.user.userId });
//     res.status(200).json(quizzes);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quizzes' });
//   }
// });

// // Edit Quiz
// router.put('/edit/:quizId', isCreator, async (req, res) => {
//   const { title, questions, duration } = req.body;
//   try {
//     const quiz = await Quiz.findByIdAndUpdate(
//       req.params.quizId,
//       { title, questions, duration },
//       { new: true }
//     );
//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating quiz' });
//   }
// });

// // Delete Quiz
// router.delete('/delete/:quizId', isCreator, async (req, res) => {
//   try {
//     await Quiz.findByIdAndDelete(req.params.quizId);
//     res.status(200).json({ message: 'Quiz deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting quiz' });
//   }
// });

// // Get Quiz Details (for learners)
// router.get('/:quizId', async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.quizId);
//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quiz' });
//   }
// });

// module.exports = router;*/


// const express = require('express');
// const jwt = require('jsonwebtoken');
// const Quiz = require('../models/Quiz');
// //const User = require('../models/User');
// const Attempt = require('../models/Attempt');
// const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware
// const { exec } = require('child_process');
// const router = express.Router();


// const isCreator = (req, res, next) => {
//   console.log('User in isCreator middleware:', req.Learners); // Debugging
//   if (!req.Learners) {
//     return res.status(401).json({ message: 'Unauthorized, token missing or invalid' });
//   }
//   if (req.user.role !== 'instructor') {
//     console.log('Access denied: Not a creator, Role:', req.user.role);
//     return res.status(403).json({ message: 'Access denied. Only creators can access this.' });
//   }
//   next();
// };





// router.get('/creator', authMiddleware, isCreator, async (req, res) => {
//   try {
//     console.log('Fetching quizzes for creator:', req.Learners);
//     const quizzes = await Quiz.find({ creator: req.Learners });
//     res.status(200).json(quizzes);
//   } catch (error) {
//     console.error('Error fetching quizzes:', error);
//     res.status(500).json({ message: 'Error fetching quizzes', error: error.message });
//   }
// });

// router.post('/create', authentic, isCreator, async (req, res) => {
//   try {
//     const { title, questions, duration } = req.body;
    
//     if (!title || !questions.length || !duration) {
//       return res.status(400).json({ message: 'Title, questions, and duration are required' });
//     }

//     console.log('Creating quiz for:', req.Learners); // Debugging

//     const quiz = new Quiz({
//       title,
//       questions,
//       enrolledLearners: req.Learners,
//       duration,
//     });

//     await quiz.save();
//     res.status(201).json(quiz);
//   } catch (error) {
//     console.error('Error creating quiz:', error);
//     res.status(500).json({ message: 'Error creating quiz', error: error.message });
//   }
// });


// // ✅ **Fix: Apply `authMiddleware` before `isCreator` for editing and deleting quizzes**
// router.put('/edit/:quizId', authMiddleware, isCreator, async (req, res) => {
//   const { title, questions, duration } = req.body;
//   try {
//     const quiz = await Quiz.findByIdAndUpdate(
//       req.params.quizId,
//       { title, questions, duration },
//       { new: true }
//     );
//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating quiz' });
//   }
// });

// router.delete('/delete/:quizId', authMiddleware, isCreator, async (req, res) => {
//   try {
//     await Quiz.findByIdAndDelete(req.params.quizId);
//     res.status(200).json({ message: 'Quiz deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting quiz' });
//   }
// });

// // Get Quiz Details (for learners)
// router.get('/:quizId', async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.quizId);
//     res.status(200).json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching quiz' });
//   }
// });

// // ✅ Add this new route at the bottom of routes/quiz.js
// router.get('/', async (req, res) => {
//   try {
//     const quizzes = await Quiz.find(); // Fetch all quizzes
//     res.status(200).json(quizzes);
//   } catch (error) {
//     console.error('Error fetching quizzes:', error);
//     res.status(500).json({ message: 'Error fetching quizzes' });
//   }
// });





// router.post('/attempt/:quizId', authMiddleware, async (req, res) => {
//   try {
//     const { answers } = req.body;
//     const userId = req.user.userId;
//     const quizId = req.params.quizId;

//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     let score = 0;
//     let correctAnswers = 0;
//     let wrongAnswers = 0;

//     for (let i = 0; i < quiz.questions.length; i++) {
//       const q = quiz.questions[i];

//       if (q.isCodingQuestion) {
//         // Send code to backend for execution (Use a judge API like Judge0 or custom execution)
//         console.log("Received coding answer:", answers[i]);

//         // For now, assume the user gets full marks (Modify this logic later)
//         score += 1;
//         correctAnswers += 1;
//       } else {
//         if (q.correctAnswer === parseInt(answers[i])) {
//           score += 1;
//           correctAnswers += 1;
//         } else {
//           wrongAnswers += 1;
//         }
//       }
//     }

//     const attempt = new Attempt({
//       learner: userId,
//       quiz: quizId,
//       score,
//       correctAnswers,
//       wrongAnswers,
//     });

//     await attempt.save();
//     res.status(201).json({
//       message: 'Quiz submitted successfully',
//       attemptId: attempt._id,
//       score,
//     });
//   } catch (error) {
//     console.error('❌ Error submitting quiz:', error);
//     res.status(500).json({ message: 'Server Error', error: error.message });
//   }
// });


// router.post('/execute', async (req, res) => {
//   const { language, code, testCases } = req.body;

//   if (!code || !testCases || !language) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     let command;
//     if (language === 'javascript') {
//       command = `node -e "${code.replace(/"/g, '\\"')}"`;
//     } else if (language === 'python') {
//       command = `python3 -c "${code.replace(/"/g, '\\"')}"`;
//     } else if (language === 'cpp') {
//       return res.status(400).json({ message: 'C++ execution not yet supported' });
//     }

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         return res.status(500).json({ error: stderr || error.message });
//       }
//       res.json({ output: stdout.trim() });
//     });

//   } catch (error) {
//     console.error('Execution error:', error);
//     res.status(500).json({ message: 'Error executing code', error: error.message });
//   }
// });




// module.exports = router;

/*const express = require("express");
const { createQuiz } = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware"); // If authentication is required
const router = express.Router();

router.post("/create", createQuiz);



module.exports = router;*/





/*const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // If authentication is required
const { createQuiz, getAllQuizzes, getQuizById,editQuiz, deleteQuiz } = require("../controllers/quizController");
//const { submitQuizAttempt } = require("../controllers/quizController");
// Create a new quiz
router.post("/create", createQuiz);

// Get all quizzes (No creator-specific filtering)
router.get("/all", getAllQuizzes);

// Edit a quiz
router.put("/edit/:quizId", editQuiz);

// Delete a quiz
router.delete("/delete/:quizId", deleteQuiz);

router.get("/:quizId", getQuizById);
//router.post("/submit", protect, submitQuizAttempt);


module.exports = router;*/




const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // If authentication is required
const { createQuiz, getAllQuizzes, getQuizById,editQuiz, deleteQuiz ,runCode} = require("../controllers/quizController");
//const { submitQuizAttempt } = require("../controllers/quizController");
const { deleteQuestionFromQuiz } = require('../controllers/quizController');
// Create a new quiz
router.post("/create", createQuiz);

// Get all quizzes (No creator-specific filtering)
router.get("/all", getAllQuizzes);

// Edit a quiz
router.put("/edit/:quizId", editQuiz);

// Delete a quiz
router.delete("/delete/:quizId", deleteQuiz);

router.get("/:quizId", getQuizById);
//router.post("/submit", protect, submitQuizAttempt);



// Other routes (get, create, update, etc.) should already exist.

router.delete('/:quizId/questions/:questionId', deleteQuestionFromQuiz);
//router.post("/run-code", runCode);

router.post('/run-code', runCode);

module.exports = router;





