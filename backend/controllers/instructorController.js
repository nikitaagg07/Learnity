const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Instructor = require("../models/Instructor");

// ✅ Register Instructor
const registerInstructor = async (req, res) => {
  try {
    console.log("➡️ Registration Attempt:", req.body);

    const {
      Salutation, FName, LName, DOB, Email, Mobile,
      AddressLine1, AddressLine2, City, State, Country,
      Qualification, Experience, Password
    } = req.body;

    // ✅ Validate required fields
    if (!Salutation || !FName || !LName || !DOB || !Email || !Mobile || !AddressLine1 ||
        !City || !State || !Country || !Qualification || !Experience || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if instructor already exists
    const existingInstructor = await Instructor.findOne({ Email });
    if (existingInstructor) {
      return res.status(400).json({ message: "Instructor already exists" });
    }

    // ✅ Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // ✅ Create New Instructor
    const newInstructor = new Instructor({
      Salutation, FName, LName, DOB, Email, Mobile,
      AddressLine1, AddressLine2, City, State, Country,
      Qualification, Experience, Password: hashedPassword
    });

    await newInstructor.save();

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: newInstructor._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      token,
      instructor: { _id: newInstructor._id, Email, FName, LName }
    });

  } catch (error) {
    console.error("🚨 Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ Login Instructor
const loginInstructor = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Find Instructor
    const instructor = await Instructor.findOne({ Email }).select("+Password");
    if (!instructor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Compare Passwords
    const isMatch = await bcrypt.compare(Password, instructor.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: instructor._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.json({
      token,
      instructor: { _id: instructor._id, FName: instructor.FName, LName: instructor.LName }
    });

  } catch (error) {
    console.error("🚨 Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};



module.exports = { registerInstructor, loginInstructor };
