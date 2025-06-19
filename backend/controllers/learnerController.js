const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const Learner = require('../models/Learner');
const Course = require('../models/Course');

// ✅ Register a new learner
exports.registerLearner = async (req, res) => {
  const { name, email, password, courses } = req.body;

  try {
    // ✅ Check if the learner already exists
    const existingLearner = await Learner.findOne({ email });
    if (existingLearner) {
      return res.status(400).json({ message: 'Learner with this email already exists' });
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create the learner
    const newLearner = new Learner({
      name,
      email,
      password: hashedPassword,
      courses: courses || [], // ✅ Default to an empty array if no courses provided
    });

    // ✅ Save the learner
    await newLearner.save();
    res.status(201).json({ message: 'Learner registered successfully', learner: newLearner });
  } catch (error) {
    console.error("Error registering learner:", error);
    res.status(500).json({ message: 'Server error, try again later' });
  }
};

// ✅ Get all learners (for admin or reporting)
exports.getAllLearners = async (req, res) => {
  try {
    const learners = await Learner.find().populate('courses', 'title'); // ✅ Fetch course titles
    res.status(200).json(learners);
  } catch (error) {
    console.error("Error fetching learners:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const { learnerId } = req.query;

    const learner = await Learner.findById(learnerId)
      .populate('courses'); // This will pull in full course documents

      console.log('getME: Learner:',learner);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    res.status(200).json({
      status: 'success',
      data: learner,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};




// Update user profile
exports.updateMe = async (req, res) => {
  try {
    // Create error if user tries to update password
    if (req.body.password) {
      return res.status(400).json({ 
        message: 'This route is not for password updates. Please use /updatePassword.' 
      });
    }
    
    // Filter out unwanted fields that should not be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'avatar', 'bio');
    
    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};


// Update password
exports.updatePassword = async (req, res) => {
  try {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    
    // Check if posted current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
      return res.status(401).json({ message: 'Your current password is incorrect' });
    }
    
    // If so, update password
    user.password = req.body.newPassword;
    await user.save();
    
    // Log user in, send JWT
    const token = signToken(user._id);
    
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error while updating password' });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get user by ID (admin only)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'No user found with that ID' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};


// PUT /api/learners/:id
const updateMe = async (req, res) => {
  try {
    const learnerId = req.params.id;

    // If the request is multipart/form-data (with FormData in frontend)
    if (req.is('multipart/form-data')) {
      const updatedFields = {};

      // Fields are sent as multipart strings, so we need to parse if necessary
      if (req.body.name) updatedFields.name = req.body.name;
      if (req.body.email) updatedFields.email = req.body.email;
      if (req.body.bio) updatedFields.bio = req.body.bio;

      if (req.body.interests) {
        try {
          updatedFields.interests = JSON.parse(req.body.interests);
        } catch (err) {
          return res.status(400).json({ message: 'Invalid interests format. Must be a JSON array.' });
        }
      }

      // If you were saving avatar to DB, you’d process it here
      // But since you’re saving avatar only in localStorage, skip this

      const updatedLearner = await Learner.findByIdAndUpdate(learnerId, updatedFields, {
        new: true,
        runValidators: true
      });

      if (!updatedLearner) {
        return res.status(404).json({ message: 'Learner not found' });
      }

      res.status(200).json({
        status: 'success',
        data: updatedLearner
      });
    } else {
      return res.status(400).json({ message: 'Unsupported content type' });
    }
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error while updating learner profile' });
  }
};

// Helper function to filter object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.enrollInCourse = async (req, res) => {
  const { learnerId, courseId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(learnerId) || !mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid Learner ID or Course ID" });
  }

  try {
    const learner = await Learner.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Correctly check for existing enrollment
    const alreadyEnrolled = learner.courses.some(id => id.equals(courseId));
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Learner is already enrolled in this course' });
    }

    // ✅ Enroll learner
    learner.courses.push(courseId);
    await learner.save();

    res.status(200).json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Get courses a learner is enrolled in (with full details)
exports.getEnrolledCourses = async (req, res) => {
  const { learnerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(learnerId)) {
    return res.status(400).json({ message: "Invalid Learner ID" });
  }

  try {
    // ✅ Populate course details (title, category, image)
    const learner = await Learner.findById(learnerId).populate("courses", "title category image description level");

    if (!learner) {
      return res.status(404).json({ message: "Learner not found." });
    }

    res.status(200).json(learner.courses); 
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


// New function for recommending courses based on enrolled courses
exports.getRecommendedCourses = async (req, res) => {
  try {
    const learnerId = req.params.learnerId;
    const limit = parseInt(req.query.limit) || 8; // Default to 8 recommendations
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(learnerId)) {
      return res.status(400).json({ message: 'Invalid learner ID' });
    }
    
    // Find learner and enrolled courses
    const learner = await Learner.findById(learnerId);
    
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    
    // If learner has no enrolled courses, recommend popular courses
    if (!learner.enrolledCourses || learner.enrolledCourses.length === 0) {
      const popularCourses = await Course.find()
        .sort({ enrollmentCount: -1 }) // Sort by enrollment count if available
        .limit(limit);
        
      return res.status(200).json({
        recommendationType: 'popular',
        recommendations: popularCourses
      });
    }
    
    // Get enrolled courses with details to use for recommendations
    const enrolledCourses = await Course.find({
      _id: { $in: learner.enrolledCourses }
    });
    
    // Extract categories and instructors from enrolled courses
    const enrolledCategories = enrolledCourses.map(course => course.category);
    const enrolledInstructors = enrolledCourses.map(course => course.instructorName);
    const enrolledLevels = enrolledCourses.map(course => course.level);
    
    // Find courses in similar categories, by same instructors, or of similar/next levels
    // but exclude already enrolled courses
    const recommendedCourses = await Course.aggregate([
      {
        $match: {
          $and: [
            { _id: { $nin: learner.enrolledCourses } }, // Exclude enrolled courses
            {
              $or: [
                { category: { $in: enrolledCategories } },
                { instructorName: { $in: enrolledInstructors } },
                { level: { $in: enrolledLevels } }
              ]
            }
          ]
        }
      },
      // Add a score field based on matching criteria
      {
        $addFields: {
          score: {
            $add: [
              { $cond: [{ $in: ["$category", enrolledCategories] }, 3, 0] }, // Category match: 3 points
              { $cond: [{ $in: ["$instructorName", enrolledInstructors] }, 2, 0] }, // Instructor match: 2 points
              { $cond: [{ $in: ["$level", enrolledLevels] }, 1, 0] } // Level match: 1 point
            ]
          }
        }
      },
      { $sort: { score: -1 } }, // Sort by score
      { $limit: limit },
      // Project to include only necessary fields and exclude the score
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          category: 1,
          level: 1,
          image: 1,
          instructorName: 1
        }
      }
    ]);
    
    // If no recommendations based on enrollment, fall back to popular courses
    if (recommendedCourses.length === 0) {
      const popularCourses = await Course.find({
        _id: { $nin: learner.enrolledCourses }
      })
      .sort({ enrollmentCount: -1 })
      .limit(limit);
      
      return res.status(200).json({
        recommendationType: 'popular',
        recommendations: popularCourses
      });
    }
    
    res.status(200).json({
      recommendationType: 'based_on_enrollment',
      recommendations: recommendedCourses
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error getting course recommendations',
      error: error.message
    });
  }
};

// Advanced recommendation function with content-based filtering
exports.getAdvancedRecommendations = async (req, res) => {
  try {
    const learnerId = req.params.learnerId;
    const limit = parseInt(req.query.limit) || 8;
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(learnerId)) {
      return res.status(400).json({ message: 'Invalid learner ID' });
    }
    
    // Find learner with progress data
    const learner = await Learner.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    
    // Get enrolled courses
    const enrolledCourses = await Course.find({
      _id: { $in: learner.enrolledCourses }
    });
    
    // If no enrolled courses, return popular ones
    if (enrolledCourses.length === 0) {
      const popularCourses = await Course.find()
        .sort({ enrollmentCount: -1 })
        .limit(limit);
        
      return res.status(200).json({
        recommendationType: 'popular',
        recommendations: popularCourses
      });
    }
    
    // Get learner's progress data to find their interests
    const progressData = await Progress.find({ learnerId: learnerId });
    
    // Create a profile of learner's interests and behavior
    const profile = {
      categories: {},
      levels: {},
      instructors: {},
      completedCourses: []
    };
    
    // Process enrolled courses and progress data
    enrolledCourses.forEach(course => {
      // Count category interests
      if (!profile.categories[course.category]) {
        profile.categories[course.category] = 1;
      } else {
        profile.categories[course.category]++;
      }
      
      // Count level interests
      if (!profile.levels[course.level]) {
        profile.levels[course.level] = 1;
      } else {
        profile.levels[course.level]++;
      }
      
      // Count instructor interests
      if (!profile.instructors[course.instructorName]) {
        profile.instructors[course.instructorName] = 1;
      } else {
        profile.instructors[course.instructorName]++;
      }
    });
    
    // Check progress data to determine completed courses
    progressData.forEach(progress => {
      if (progress.status === 'completed' && progress.progressPercentage >= 90) {
        profile.completedCourses.push(progress.courseId);
      }
    });
    
    // Determine dominant interests
    const topCategories = Object.entries(profile.categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    const topLevels = Object.entries(profile.levels)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(entry => entry[0]);
    
    const topInstructors = Object.entries(profile.instructors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // Find next level (for progression)
    const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentTopLevel = topLevels[0] || 'beginner';
    const currentLevelIndex = levelOrder.indexOf(currentTopLevel.toLowerCase());
    const nextLevel = currentLevelIndex < levelOrder.length - 1 ? 
                      levelOrder[currentLevelIndex + 1] : currentTopLevel;
    
    // Build recommendation query
    const recommendationQuery = await Course.aggregate([
      {
        $match: {
          $and: [
            { _id: { $nin: learner.enrolledCourses } }, // Exclude enrolled courses
            {
              $or: [
                { category: { $in: topCategories } },
                { level: { $in: [...topLevels, nextLevel] } },
                { instructorName: { $in: topInstructors } }
              ]
            }
          ]
        }
      },
      // Add a score based on matching criteria
      {
        $addFields: {
          score: {
            $add: [
              { $cond: [{ $in: ["$category", topCategories] }, 5, 0] },
              { $cond: [{ $eq: ["$level", nextLevel] }, 4, 0] },
              { $cond: [{ $in: ["$level", topLevels] }, 3, 0] },
              { $cond: [{ $in: ["$instructorName", topInstructors] }, 2, 0] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1, 
          category: 1,
          level: 1,
          image: 1,
          instructorName: 1,
          matchScore: "$score" // Include the match score in the results
        }
      }
    ]);
    
    // If no matches, fall back to popular courses
    if (recommendationQuery.length === 0) {
      const popularCourses = await Course.find({
        _id: { $nin: learner.enrolledCourses }
      })
      .sort({ enrollmentCount: -1 })
      .limit(limit);
      
      return res.status(200).json({
        recommendationType: 'popular',
        recommendations: popularCourses
      });
    }
    
    res.status(200).json({
      recommendationType: 'personalized',
      learnerProfile: {
        topCategories,
        currentLevel: currentTopLevel,
        suggestedNextLevel: nextLevel
      },
      recommendations: recommendationQuery
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error getting advanced course recommendations',
      error: error.message
    });
  }
};