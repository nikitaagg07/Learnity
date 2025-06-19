const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController'); // Import controller functions

const router = express.Router();

// POST /api/auth/register route for user registration
router.post('/register', registerUser);

// POST /api/auth/login route for user login
router.post('/login', loginUser);

module.exports = router;
