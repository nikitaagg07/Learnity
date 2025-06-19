const express = require("express");
const { registerAdmin,
    loginAdmin,
    getSystemStats,
    getUserStats,
    getPendingInstructors, 
    approveInstructor,
    getLearners,
    getLearnerCourses,
      getApprovedInstructors,
      getInstructorCourses,
      getAllAdmins,
    getCourseStats,
    getRecentCourses,
    approveCourse,
    getSupportRequests,
    fetchUserGrowthData,
    getUserActivityStats,
    resolveSupportRequest,
    getPaymentTransactions,
    getFilteredCourses } = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Admin Dashboard Routes
router.get('/system-stats',getSystemStats);
router.get('/user-stats', getUserStats);
router.get('/user-activity', getUserActivityStats);

//View learners
router.get('/learners',getLearners);
router.get('/learners/:id/courses', getLearnerCourses);

//view instructors
router.get('/instructors/approved', getApprovedInstructors);
router.get('/instructors/:id/courses', getInstructorCourses);

router.get('/all-admins', getAllAdmins);

router.get('/instructors/pending', getPendingInstructors);
router.put('/instructors/:id/approve', approveInstructor);
router.get('/course-stats', getCourseStats);
router.get('/courses', getFilteredCourses);
router.get('/recent-courses', getRecentCourses);
router.put('/courses/:id/approve', approveCourse);
router.get('/support', getSupportRequests);
router.put('/support/:id/resolve', resolveSupportRequest);
router.get('/payment-transactions', getPaymentTransactions);

module.exports = router;
