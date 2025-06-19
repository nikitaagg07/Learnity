// //     const express = require('express');
// //     const router = express.Router();
// //     const courseController = require('../controllers/courseController');

// //     // const { enrollInCourse, getEnrolledCourses } = require('../controllers/coursesController');


// //     // Create a new course
// //     router.post('/', courseController.createCourse);

// //     // Get all courses
// //     router.get('/', courseController.getCourses);

// //     // Get a specific course by ID
// //     router.get('/:id', courseController.getCourseById);

// //     // Update a course by ID (Fixed parameter name)
// //     router.put('/:id', courseController.updateCourse);
    
// // // Delete a course by ID
// // router.delete('/:id', courseController.deleteCourse);  // Use `id` as the route parameter

// //     module.exports = router;

// const express = require("express");
// const { protectInstructor } = require("../middleware/authMiddleware");
// const {
//   createCourse, 
//   getCourses,  // ✅ Ensure this function is defined in the controller
//   getCourseById,
//   updateCourse, 
//   deleteCourse
// } = require("../controllers/courseController");

// const router = express.Router();

// // ✅ Get all courses (for debugging)
// router.get("/", getCourses);

// // ✅ Get a specific course by ID
// router.get("/:id", getCourseById);

// // ✅ Create a new course (Protected)
// router.post("/", protectInstructor, createCourse);

// // ✅ Update a course (Protected)
// router.put("/:id", protectInstructor, updateCourse);

// // ✅ Delete a course (Protected)
// router.delete("/:id", protectInstructor, deleteCourse);

// module.exports = router;


const express = require("express");
const { protectInstructor,authMiddleware } = require("../middleware/authMiddleware");
const {
  createCourse, getCourses, getCourseById, updateCourse, deleteCourse,getInstructorCourses,getCourseLearners,enrollLearnerInCourse
} = require("../controllers/courseController");

const router = express.Router();

// ✅ Apply token authentication (protectInstructor) to protected routes
router.post("/", protectInstructor, createCourse);
router.put("/:id", protectInstructor, updateCourse);
router.delete("/:id", protectInstructor, deleteCourse);
// ✅ Ensure authentication middleware is applied
router.get("/instructor", authMiddleware, getInstructorCourses);  
router.get("/:id/learners", protectInstructor, getCourseLearners);

// Public routes (no authentication required)
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/:id/enroll", enrollLearnerInCourse);


module.exports = router;
