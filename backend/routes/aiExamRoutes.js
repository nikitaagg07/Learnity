const express = require("express");
const router = express.Router();
const aiExamController = require("../controllers/aiExamController");

// Define routes
router.post("/", aiExamController.createAIExam);
router.get("/", aiExamController.getAllAIExams);
router.get("/:examId", aiExamController.getExamById);
router.put("/:examId", aiExamController.updateExam);
router.delete("/:examId", aiExamController.deleteExam);

module.exports = router;
