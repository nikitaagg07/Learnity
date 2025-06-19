const Progress = require("../models/Progress");
const Course = require("../models/Course");
const mongoose = require("mongoose");

exports.updateProgress = async (req, res) => {
  try {
    const { learnerId, courseId, lessonIndex, timeSpent } = req.body;

    if (!learnerId) {
      return res.status(400).json({ success: false, message: "Missing learnerId" });
    }

    let progress = await Progress.findOne({ learner: learnerId, course: courseId });

    if (!progress) {
      progress = new Progress({
        learner: learnerId,
        course: courseId,
        completedLessons: [],
      });
    }

    if (!progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }

    // Calculate progress percentage
    const course = await Course.findById(courseId);
    progress.progressPercentage =
      (progress.completedLessons.length / course.curriculum.length) * 100;

    // Update timeSpent if available
    if (typeof timeSpent === "number" && timeSpent > 0) {
      progress.timeSpent = (progress.timeSpent || 0) + timeSpent;
    }

    await progress.save();
    res.status(200).json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Fetch learner progress
exports.getLearnerProgress = async (req, res) => {
  try {
    const { learnerId, courseId } = req.params;
    
    console.log("Fetching progress for learner:", { learnerId, courseId });
    
    if (!mongoose.Types.ObjectId.isValid(learnerId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid learnerId or courseId format." });
    }
    
    const progress = await Progress.findOne({ learner: learnerId, course: courseId });
    
    if (!progress) {
      return res.status(200).json({ 
        completedLessons: [], 
        progressPercentage: 0 
      });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching learner progress:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all learners' progress for an instructor
exports.getInstructorLearnersProgress = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    console.log("Fetching instructor learners progress:", { instructorId });
    
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      return res.status(400).json({ success: false, message: "Invalid instructorId format." });
    }
    
    const courses = await Course.find({ instructor: instructorId, isPublished: true }).select("_id title");
    
    if (!courses || courses.length === 0) {
      return res.status(200).json([]);
    }
    
    const courseIds = courses.map(course => course._id);
    
    const progressData = await Progress.find({ course: { $in: courseIds } })
      .populate("learner", "name email")
      .populate("course", "title");
    
    res.status(200).json(progressData);
  } catch (error) {
    console.error("Error fetching instructor learners progress:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};