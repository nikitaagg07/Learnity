const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createSupportRequest, getSupportRequestsByUser, updateSupportStatus } = require("../controllers/supportController");

// ✅ Setup `multer` for file uploads (Store in `uploads/` folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage }).single("file");

// ✅ Route: Create a support request (Learner & Instructor)
router.post("/create", upload, createSupportRequest);

// ✅ Route: Fetch support requests (Learner or Instructor)
router.get("/", getSupportRequestsByUser);

// ✅ Route: Update support request status
router.put("/:id/status", updateSupportStatus);

module.exports = router;
