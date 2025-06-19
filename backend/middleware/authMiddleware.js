// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Instructor = require("../models/Instructor");
const Admin = require("../models/Admin");

// ✅ Plain Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This gets passed on to other middleware
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// ✅ Protect Instructor
const protectInstructor = async (req, res, next) => {
  authMiddleware(req, res, async () => {
    try {
      const instructor = await Instructor.findById(req.user.userId).select("-Password");
      if (!instructor) {
        return res.status(403).json({ message: "Access Denied: Instructor not found" });
      }
      req.user = instructor;
      next();
    } catch (error) {
      console.error("Instructor auth error:", error);
      res.status(500).json({ message: "Server error in instructor auth" });
    }
  });
};


// ✅ Admin Auth Middleware
const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};


module.exports = { authMiddleware, protectInstructor , protectAdmin};
