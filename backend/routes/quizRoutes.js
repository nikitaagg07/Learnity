
// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const quizController = require("../controllers/quizController");

// Define routes
router.post("/create", authMiddleware, quizController.createQuiz);
router.get("/", quizController.getAllQuizzes);
router.get("/:quizId", quizController.getQuizById);
router.put("/:quizId", authMiddleware, quizController.updateQuiz);
router.delete("/:quizId", authMiddleware, quizController.deleteQuiz);

module.exports = router;