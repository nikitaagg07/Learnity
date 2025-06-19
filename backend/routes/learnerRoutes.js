// routes/learnerRoutes.js
const express = require('express');
const { registerLearner, getAllLearners, enrollInCourse, getEnrolledCourses,getRecommendedCourses,getMe,updatePassword,updateMe,
    getAdvancedRecommendations  } = require('../controllers/learnerController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST route to register a learner
router.post('/register', registerLearner);

// GET route to fetch all learners (for testing or admin purposes)
router.get('/', getAllLearners);
router.put('/:id', updateMe);

// POST route for enrolling in a course
router.post('/enroll', enrollInCourse);

// GET route for fetching courses a learner is enrolled in
// router.get('/enrolled/:id', getEnrolledCourses);
router.get("/enrolled/:learnerId", getEnrolledCourses);

// GET route for course recommendations based on enrolled courses
router.get("/recommendations/:learnerId", getRecommendedCourses);

// GET route for advanced personalized recommendations
router.get("/advanced-recommendations/:learnerId", getAdvancedRecommendations);
    

// Protected routes - require authentication
router.get('/me',getMe);
router.patch('/updateMe',updateMe);
router.patch('/updatePassword',updatePassword);


module.exports = router;
