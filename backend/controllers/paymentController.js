const Learner = require("../models/Learner");
const Payment = require("../models/Payment");
const Course = require("../models/Course");

const processPayment = async (req, res) => {
  const { userId, courseId, paymentMethod } = req.body;

  // Validate request data
  if (!userId || !courseId || !paymentMethod) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Fetch the course to verify it exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    console.log("💾 Course fetched:", course); // Log the fetched course data

    // Fetch the learner to update their courses
    const learner = await Learner.findById(userId);
    if (!learner) {
      return res.status(404).json({ success: false, message: "Learner not found" });
    }

    // Check if the learner already has the course
    if (learner.courses.includes(courseId)) {
      return res.status(400).json({ success: false, message: "Course already purchased" });
    }

    // Mock Payment Processing
    const transactionId = `PAY-${Math.random().toString(36).substr(2, 9)}`; // Generate a random transaction ID
    const amountPaid = course.pricing; // Fetching price from course

    // Save the payment details in the database
    const payment = new Payment({
      userId,
      courseId,
      courseTitle: course.title, // Save course title
      amount: amountPaid,
      paymentMethod,
      paymentStatus: "Success", // Mock successful payment
      transactionId,
    });

    // Save the payment to the database
    await payment.save();

    console.log("✅ Payment saved successfully!");

    // Update the learner's courses array by adding the new course
    learner.courses.push(courseId); // Add the purchased course to the learner's courses
    await learner.save(); // Save the updated learner

    console.log("📚 Learner's courses updated successfully!");

    // Send response back to frontend
    res.status(200).json({
      success: true,
      message: "Payment successful! Course added to your account.",
      paymentId: transactionId,
      amountPaid,
      paymentMethod,
      courseTitle: course.title, // Return the course title
    });
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    res.status(500).json({ success: false, message: "Payment failed", error: error.message });
  }
};

module.exports = { processPayment };
