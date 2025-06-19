const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Learner = require("../models/Learner");

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    console.log("➡️ Registration Attempt:", req.body); // ✅ Log request body

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await Learner.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("🔑 Hashing Password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log("✅ Creating New User...");
    const newLearner = new Learner({ name, email, password: hashedPassword });
    await newLearner.save();

    console.log("🛡 Generating Token...");
    const token = jwt.sign({ userId: newLearner._id }, process.env.JWT_SECRET, { expiresIn: "4h" });

    console.log("✅ Registration Successful");
    res.status(201).json({ token, learner: { _id: newLearner._id, name, email } });

  } catch (error) {
    console.error("🚨 Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;  // ✅ Fixed casing

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const learner = await Learner.findOne({ email });
    if (!learner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Compare hashed passwords
    const isMatch = await bcrypt.compare(password, learner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: learner._id, role: "learner" }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.json({ token, learnerId: learner._id, name: learner.name });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { registerUser, loginUser };
