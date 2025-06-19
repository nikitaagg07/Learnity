// controllers/adminController.js
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const Instructor = require("../models/Instructor");
const Learner = require('../models/Learner');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const SupportRequest = require('../models/Support');
const Enrollment = require('../models/Enrollment');

// Admin Registration
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match.");
  }

  if (await Admin.findOne({ email })) {
    res.status(400);
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Admin registered successfully!",
    admin: newAdmin,
  });
});

// Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }

  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({
    message: "Login successful",
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
});

// 📌 Get system statistics
const getSystemStats = asyncHandler(async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const totalInstructors = await Instructor.countDocuments();
    const totalLearners = await Learner.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: 'published' });
    const pendingInstructorApprovals = await Instructor.countDocuments({ ApprovalStatus: 'pending' });

    const totalUsers = totalAdmins + totalInstructors + totalLearners;

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month

    // Total Revenue (All time)
    const totalRevenueResult = await Payment.aggregate([
      { $match: { paymentStatus: "Success" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

    // Revenue This Month
    const thisMonthRevenueResult = await Payment.aggregate([
      { 
        $match: { 
          paymentStatus: "Success", 
          createdAt: { $gte: startOfCurrentMonth }
        }
      },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const thisMonthRevenue = thisMonthRevenueResult.length > 0 ? thisMonthRevenueResult[0].totalRevenue : 0;

    // Revenue Last Month
    const lastMonthRevenueResult = await Payment.aggregate([
      { 
        $match: { 
          paymentStatus: "Success", 
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        }
      },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const lastMonthRevenue = lastMonthRevenueResult.length > 0 ? lastMonthRevenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalCourses,
      activeCourses,
      pendingApprovals: pendingInstructorApprovals,
      recentEnrollments: 0,
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue
    });
  } catch (error) {
    console.error("getSystemStats error:", error);
    res.status(500).json({ error: 'Error fetching system stats' });
  }
});

const getUserStats = asyncHandler(async (req, res) => {
  try {
    // Get the current date and prepare the last 6 months
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        startOfMonth: new Date(date.getFullYear(), date.getMonth(), 1),
        endOfMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      };
    });

    // Fetch month-by-month user stats
    const userStats = await Promise.all(
      months.map(async (month) => {
        const thisMonthUsers = await Admin.countDocuments({ createdAt: { $gte: month.startOfMonth, $lte: month.endOfMonth } })
          + await Instructor.countDocuments({ createdAt: { $gte: month.startOfMonth, $lte: month.endOfMonth } })
          + await Learner.countDocuments({ createdAt: { $gte: month.startOfMonth, $lte: month.endOfMonth } });

        return { month: month.month, users: thisMonthUsers };
      })
    );

    // Calculate total users and other stats
    const totalAdmins = await Admin.countDocuments();
    const totalInstructors = await Instructor.countDocuments();
    const totalLearners = await Learner.countDocuments();
    const newInstructorRequests = await Instructor.countDocuments({ ApprovalStatus: 'pending' });

    // This month and last month user counts
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Count only new users created in this month
    const thisMonthUsers = await Admin.countDocuments({ 
      createdAt: { 
        $gte: startOfThisMonth,
        $lte: now 
      } 
    }) + await Instructor.countDocuments({ 
      createdAt: { 
        $gte: startOfThisMonth,
        $lte: now 
      } 
    }) + await Learner.countDocuments({ 
      createdAt: { 
        $gte: startOfThisMonth,
        $lte: now 
      } 
    });

    // Count only new users created in last month
    const lastMonthUsers = await Admin.countDocuments({ 
      createdAt: { 
        $gte: startOfLastMonth, 
        $lte: endOfLastMonth 
      } 
    }) + await Instructor.countDocuments({ 
      createdAt: { 
        $gte: startOfLastMonth, 
        $lte: endOfLastMonth 
      } 
    }) + await Learner.countDocuments({ 
      createdAt: { 
        $gte: startOfLastMonth, 
        $lte: endOfLastMonth 
      } 
    });

    // Calculate user growth rate
    const userGrowthRate = lastMonthUsers
      ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
      : 0;

    // Return the response
    res.json({
      userGrowthData: userStats,
      totalUsers: totalAdmins + totalInstructors + totalLearners,
      totalAdmins,
      totalInstructors,
      totalLearners,
      newInstructorRequests,
      thisMonthUsers,
      lastMonthUsers,
      userGrowthRate,
    });
  } catch (error) {
    console.error('getUserStats error:', error);
    res.status(500).json({ error: 'Error fetching user stats' });
  }
});


            ///User Management


// 📌 Get all pending instructor approval requests
const getPendingInstructors = asyncHandler(async (req, res) => {
  try {
    const pendingInstructors = await Instructor.find({ ApprovalStatus: 'pending' })
      .select('FName LName Qualification Experience')
      .lean();

    res.json(pendingInstructors);
  } catch (error) {
    console.error("Error fetching pending instructors:", error);
    res.status(500).json({ message: "Error fetching pending instructors" });
  }
});

// 📌 Approve a specific instructor
const approveInstructor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedInstructor = await Instructor.findByIdAndUpdate(
    id,
    { ApprovalStatus: 'approved' },
    { new: true }
  );

  if (!updatedInstructor) {
    res.status(404);
    throw new Error("Instructor not found");
  }

  res.json({ message: 'Instructor approved', instructor: updatedInstructor });
});


//View Learners with payments
const getLearners = asyncHandler(async (req, res) => {
  const learners = await Learner.find();

  const learnersWithDetails = await Promise.all(
    learners.map(async (learner) => {
      const payments = await Payment.find({ userId: learner._id, paymentStatus: 'Success' });
      const totalAmountPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);

      return {
        _id: learner._id,
        name: learner.name,
        email: learner.email,
        courseCount: learner.courses?.length || 0,
        totalAmountPaid
      };
    })
  );

  res.json(learnersWithDetails);
});

//subtable : learner-courses
const getLearnerCourses = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch payments for this learner with paymentStatus = "Success"
  const payments = await Payment.find({ userId: id, paymentStatus: "Success" });

  // Map to course info for frontend
  const courses = payments.map(payment => ({
    courseName: payment.courseTitle || 'Unknown Course',
    amount: payment.amount,
    joiningDate: payment.createdAt
  }));

  res.json(courses);
});

//View Approved Instructors
const getApprovedInstructors = asyncHandler(async (req, res) => {
  const instructors = await Instructor.find({ ApprovalStatus: 'approved' }).lean();

  const result = await Promise.all(
    instructors.map(async (inst) => {
      const courseCount = inst.Courses?.length || 0;

      return {
        _id: inst._id,
        name: `${inst.FName} ${inst.LName}`,
        email: inst.Email,
        mobile: inst.Mobile,
        qualification: inst.Qualification,
        experience: inst.Experience,
        courseCount
      };
    })
  );

  res.json(result);
});

//Subtable of View Instructors with courses
const getInstructorCourses = asyncHandler(async (req, res) => {
  const instructorId = req.params.id;

  const instructor = await Instructor.findById(instructorId).lean();

  if (!instructor || !Array.isArray(instructor.Courses)) {
    return res.status(404).json({ message: 'Instructor not found or invalid course data' });
  }

  const courseIds = instructor.Courses.map(id => new mongoose.Types.ObjectId(id));
  const courses = await Course.find({ _id: { $in: courseIds } }).lean();

  // Map clean response
  const result = courses.map(course => ({
    title: course.title || 'Untitled',
    category: course.category || 'N/A',
    level: course.level || 'N/A',
    price: course.pricing ?? 'N/A',
    status: course.status || 'N/A',
    createdAt: course.createdAt || course.date || null
  }));

  res.json(result);
});


//View All Admins
const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({}, 'AdminID name email'); // only select required fields
  res.json(admins);
});

// 📌 Get course statistics
const getCourseStats = asyncHandler(async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const pendingCourses = await Course.countDocuments({ status: 'draft' });

    const activeCategoryDocs = await Course.distinct("category", {
      status: 'published',
      category: { $nin: [null, ""] }
    });
    const activeCategories = activeCategoryDocs.length;

    // This month and last month courses counts
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    console.log('Start of month:', startOfMonth);
    console.log('End of month:', endOfMonth);


    const coursesThisMonth = await Course.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    res.json({ 
      totalCourses, 
      pendingCourses, 
      activeCategories, 
      coursesThisMonth 
    });
  } catch (error) {
    console.error("getCourseStats error:", error);
    res.status(500).json({ error: 'Error fetching course stats' });
  }
});

// Updated getRecentCourses function
const getRecentCourses = asyncHandler(async (req, res) => {
  try {
    // First, let's check if we have any instructors in the database
    const instructorCount = await Instructor.countDocuments();
    console.log(`Total instructors in database: ${instructorCount}`);
    
    // Check the Course model's instructor field
    const sampleCourse = await Course.findOne().lean();
    console.log('Sample course:', {
      id: sampleCourse?._id,
      title: sampleCourse?.title,
      instructorField: sampleCourse?.instructor // Check what's stored here
    });
    
    // Get recent courses with improved populate
    const recentCourses = await Course.find()
    .sort({ date: -1 })
      .populate({
        path: 'instructor',
        select: 'FName LName email',
        model: 'Instructor' // Explicitly specify the model
      })
      .lean();

    console.log(`Found ${recentCourses.length} courses`);
    
    // Check the first course's raw data
    if (recentCourses.length > 0) {
      console.log('First course raw data:', JSON.stringify(recentCourses[0], null, 2));
    }

    // Map with better error handling
    const formattedCourses = await Promise.all(recentCourses.map(async course => {
      let instructorName = 'Unknown Instructor';
      
      // Try to get instructor from populated field
      if (course.instructor && (course.instructor.FName || course.instructor.LName)) {
        instructorName = `${course.instructor.FName || ''} ${course.instructor.LName || ''}`.trim();
      } 
      // Fallback: Try to fetch instructor directly if we have an ID but populate failed
      else if (course.instructor && mongoose.Types.ObjectId.isValid(course.instructor)) {
        try {
          const instructorDoc = await Instructor.findById(course.instructor).select('FName LName').lean();
          if (instructorDoc) {
            instructorName = `${instructorDoc.FName || ''} ${instructorDoc.LName || ''}`.trim();
          }
        } catch (err) {
          console.error(`Failed to fetch instructor for course ${course._id}:`, err);
        }
      }
      
      // Format dates
      let formattedDate = null;
      if (course.date) {
        try {
          const date = new Date(course.date);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedDate = `${day}/${month}/${year}`;
          }
        } catch (error) {
          console.error('Error formatting date:', error);
        }
      }

      let formattedCreatedAt = null;
      if (course.createdAt) {
        try {
          const date = new Date(course.createdAt);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedCreatedAt = `${day}/${month}/${year}`;
          }
        } catch (error) {
          console.error('Error formatting createdAt:', error);
        }
      }
      
      return {
        id: course._id,
        title: course.title || 'Untitled Course',
        instructorName: instructorName || 'Unnamed Instructor',
        instructorId: course.instructor?._id || course.instructor,
        category: course.category || 'Uncategorized',
        level: course.level || 'Not Specified',
        primaryLanguage: course.primaryLanguage || 'Not Specified',
        subtitle: course.subtitle || 'No subtitle available',
        description: course.description || '',
        pricing: course.pricing ?? 0,
        date: formattedDate,
        createdAt: formattedCreatedAt,
        status: course.status || 'draft'
      };
    }));

    // Log the formatted data for the first few courses
    console.log('Formatted course data sample:', formattedCourses.slice(0, 2));

    res.status(200).json({
      success: true,
      recentCourses: formattedCourses,
    });
  } catch (error) {
    console.error('Error fetching recent courses:', error);
    res.status(500).json({ success: false, message: 'Error fetching recent courses' });
  }
});


//Approve Course
const approveCourse = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Approving course with ID:', id); // Debug log

    const course = await Course.findById(id)
      .populate({
        path: 'instructor',
        select: 'FName LName Email ApprovalStatus'
      });

    if (!course) {
      console.log('Course not found for ID:', id); // Debug log
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    console.log('Found course:', course); // Debug log

    // Update course status
    course.status = 'published';
    course.isPublished = true;
    await course.save();

    // Update instructor's approval status if needed
    if (course.instructor) {
      course.instructor.ApprovalStatus = 'approved';
      await course.instructor.save();
    }

    const responseData = {
      success: true,
      message: 'Course approved successfully',
      course: {
        _id: course._id,
        title: course.title,
        status: course.status,
        instructor: course.instructor ? {
          FName: course.instructor.FName,
          LName: course.instructor.LName,
          Email: course.instructor.Email,
          ApprovalStatus: course.instructor.ApprovalStatus
        } : null
      }
    };

    console.log('Sending response:', responseData); // Debug log
    res.json(responseData);
  } catch (error) {
    console.error('Error approving course:', error);
    res.status(500).json({ success: false, message: 'Error approving course', error: error.message });
  }
});



const getUserActivityStats = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch learner activity
    const studentActivity = await Learner.aggregate([
      { $match: { createdAt: { $gte: startOfThisMonth } } },
      {
        $project: {
          name: "$name",
          role: { $literal: "Learner" },
          lastActivity: "$createdAt",
          status: { $literal: "active" },
          createdAt: 1
        }
      }
    ]);

    // Fetch instructor activity
    const instructorActivity = await Instructor.aggregate([
      { $match: { createdAt: { $gte: startOfThisMonth } } },
      {
        $project: {
          name: { $concat: ["$FName", " ", "$LName"] },
          role: { $literal: "Instructor" },
          lastActivity: "$createdAt",
          status: { $literal: "active" },
          createdAt: 1
        }
      }
    ]);

    // Fetch admin activity
    const adminActivity = await Admin.aggregate([
      { $match: { createdAt: { $gte: startOfThisMonth } } },
      {
        $project: {
          name: "$name",
          role: { $literal: "Admin" },
          lastActivity: "$createdAt",
          status: { $literal: "active" },
          createdAt: 1
        }
      }
    ]);

    // Combine all activities
    const allUserActivity = [...studentActivity, ...instructorActivity, ...adminActivity];

    // Sort activities by latest
    allUserActivity.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    // Format response
    const userActivityData = allUserActivity.map(user => ({
      name: user.name,
      role: user.role,
      lastActivity: user.lastActivity,
      status: user.status,
      actions: [
        { label: "View", url: `/user/${user.role.toLowerCase()}/${user.name}` },
        { label: "Edit", url: `/edit-user/${user.role.toLowerCase()}/${user.name}` }
      ]
    }));

    res.json(userActivityData);
  } catch (error) {
    console.error('getUserActivityStats error:', error);
    res.status(500).json({ error: 'Error fetching user activity stats' });
  }
});



// 📌 Get support requests
// 📌 Get support requests with user name
const getSupportRequests = asyncHandler(async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const supportRequests = await SupportRequest.find(query)
      .populate({
        path: 'userId',
        select: 'FName LName name', 
      })
      .sort({ createdAt: -1 })
      .lean();

    // Format for frontend
    const formattedRequests = supportRequests.map(req => ({
      ...req,
      userName: req.userId?.FName && req.userId?.LName
        ? `${req.userId.FName} ${req.userId.LName}`
        : req.userId?.name || req.userId?.email || 'Unknown',
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error("Support Fetch Error:", error);
    res.status(500).json({ error: 'Error fetching support requests' });
  }
});
 


//Resolve Support
const resolveSupportRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Support ID" });
  }

  const updatedSupport = await SupportRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedSupport) {
    return res.status(404).json({ message: "Support ticket not found" });
  }

  res.status(200).json({ message: "Support status updated", updatedSupport });
});




// 📌 Get payment transactions
const getPaymentTransactions = asyncHandler(async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let filter = {};
    // Only add status to filter if it's not 'all' and exists
    if (status && status !== 'all') {
      filter.paymentStatus = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        select: 'name',
      })
      .populate('courseId', 'title');

    const totalRevenue = payments.reduce((sum, txn) =>
      txn.paymentStatus === 'Success' ? sum + txn.amount : sum, 0);
    const totalPayments = payments.length;
    const recentTransactions = payments.slice(-10).reverse().map(p => ({
      id: p.transactionId,
      userId: p.userId?._id,
      userName: p.userId?.name || 'Unknown',
      courseId: p.courseId?._id,
      courseName: p.courseId ? p.courseId.title : 'Unknown',
      amount: p.amount,
      paymentMethod: p.paymentMethod,
      status: p.paymentStatus,
      date: p.createdAt.toISOString().split('T')[0]
    }));

    res.json({ 
      recentTransactions, 
      totalRevenue, 
      totalPayments 
    });
  } catch (error) {
    console.error('Error in getPaymentTransactions:', error);
    res.status(500).json({ error: 'Error fetching payment transactions' });
  }
});

const getFilteredCourses = asyncHandler(async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const courses = await Course.find(query)
      .sort({ date: -1 })
      .populate('instructor', 'FName LName Email')
      .lean();

    console.log('Raw course data:', JSON.stringify(courses[0], null, 2)); // Debug log

    const formattedCourses = courses.map(course => {
      // Format dates
      let formattedDate = null;
      if (course.date) {
        try {
          const date = new Date(course.date);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedDate = `${day}/${month}/${year}`;
          }
        } catch (error) {
          console.error('Error formatting date:', error);
        }
      }

      // Use date as createdAt if createdAt is not available
      const formattedCreatedAt = formattedDate;

      const formattedCourse = {
        _id: course._id,
        title: course.title || 'Untitled Course',
        instructorName: course.instructor ? `${course.instructor.FName || ''} ${course.instructor.LName || ''}`.trim() : 'Unknown Instructor',
        instructorEmail: course.instructor?.Email || course.instructor?.email || 'Not available',
        category: course.category || 'Uncategorized',
        level: course.level || 'Not specified',
        primaryLanguage: course.primaryLanguage || 'Not specified',
        subtitle: course.subtitle || 'No subtitle available',
        description: course.description || 'No description available',
        pricing: course.pricing || 0,
        status: course.status || 'draft',
        date: formattedDate || 'Not available',
        createdAt: formattedCreatedAt || 'Not available',
        totalEnrollments: course.totalEnrollments || 0,
        averageRating: course.averageRating || 0,
        totalReviews: course.totalReviews || 0,
        totalLessons: course.curriculum?.length || 0,
        requirements: course.requirements || []
      };

      console.log('Formatted course data:', JSON.stringify(formattedCourse, null, 2)); // Debug log
      return formattedCourse;
    });

    res.status(200).json({
      success: true,
      courses: formattedCourses
    });
  } catch (error) {
    console.error('Error fetching filtered courses:', error);
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
});

// ✅ Export all functions
module.exports = {
  registerAdmin,
  loginAdmin,
  getSystemStats,
  getUserStats,
  getUserActivityStats,
  getPendingInstructors, 
  approveInstructor,
  getLearners,
  getLearnerCourses,
  getApprovedInstructors,
  getInstructorCourses,
  getAllAdmins,
  getCourseStats,
  approveCourse,
  getRecentCourses,
  getSupportRequests,
  resolveSupportRequest,
  getPaymentTransactions,
  getFilteredCourses
};
