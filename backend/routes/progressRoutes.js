const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");

// Route to update progress (POST /api/progress)
router.post("/", progressController.updateProgress);

// Route to get learner progress (GET /api/progress/:learnerId/:courseId)
router.get("/:learnerId/:courseId", progressController.getLearnerProgress);

// Route to get all learners progress for an instructor (GET /api/progress/instructor/:instructorId)
router.get("/instructor/:instructorId", progressController.getInstructorLearnersProgress);

module.exports = router;