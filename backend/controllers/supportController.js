const Support = require("../models/Support");

// ✅ Create a Support Request (For Learners & Instructors)
const createSupportRequest = async (req, res) => {
  const { userId, userType, category, subject, message, relatedCourse } = req.body;
  const file = req.file ? req.file.path : null;

  // ✅ Improved Validation with Clear Messages
  if (!userId || !userType || !category || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields: userId, userType, category, subject, message." });
  }

  try {
    const supportRequest = new Support({
      userId,
      userType,
      category,
      subject,
      message,
      relatedCourse: relatedCourse && relatedCourse !== "" ? relatedCourse : null, // Ensure it's optional
      file,
    });

    await supportRequest.save();
    res.status(201).json({ message: "Support request submitted successfully!", supportRequest });
  } catch (error) {
    console.error("🚨 Error Creating Support Request:", error);
    res.status(500).json({ message: "Server error while creating support request." });
  }
};

// ✅ Get Support Requests by User
const getSupportRequestsByUser = async (req, res) => {
  const { userId, userType } = req.query;

  if (!userId || !userType) {
    return res.status(400).json({ message: "Missing userId or userType in query parameters." });
  }

  try {
    const supportRequests = await Support.find({ userId, userType })
      .populate("relatedCourse", "title"); // ✅ Fetch Course Title

    res.status(200).json(supportRequests);
  } catch (error) {
    console.error("🚨 Error Fetching Support Requests:", error);
    res.status(500).json({ message: "Failed to fetch support requests." });
  }
};



// ✅ Update Support Request Status
const updateSupportStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Resolved", "Closed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value. Allowed: Pending, Resolved, Closed." });
  }

  try {
    const updatedRequest = await Support.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: "Support request not found." });
    }
    res.json(updatedRequest);
  } catch (error) {
    console.error("🚨 Error Updating Support Request:", error);
    res.status(500).json({ message: "Failed to update support request." });
  }
};

module.exports = { createSupportRequest, getSupportRequestsByUser, updateSupportStatus };
