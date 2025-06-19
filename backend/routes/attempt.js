
/*const express = require('express');
const { submitAttempt, getAttemptById } = require('../controllers/attemptController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Submit an attempt (No role restriction)
router.post('/submit', submitAttempt);

// ✅ Get attempt details by ID
router.get('/:attemptId',  getAttemptById);

module.exports = router;*/


/*const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { submitQuiz, getAttemptById } = require("../controllers/attemptController");

router.post("/submit",  submitQuiz);
router.get("/:attemptId",  getAttemptById);

module.exports = router;*/


const express = require('express');
const router = express.Router();
const { 
  createAttempt, 
  getAttemptsByLearner, 
  getAttemptById, 
  getAttemptsByQuiz 
} = require('../controllers/attemptController');

router.post('/', createAttempt);
router.get('/attempts', getAttemptsByLearner);
//router.get('/:attemptId', getAttemptById);
router.get('/:attemptId', getAttemptById);

router.get('/quiz/:quizId/attempts', getAttemptsByQuiz);

module.exports = router;


