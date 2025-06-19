const express = require("express");
const { processPayment } = require("../controllers/paymentController"); // Import the controller
const router = express.Router();

// POST route to process the payment
router.post("/process", processPayment);

module.exports = router;
