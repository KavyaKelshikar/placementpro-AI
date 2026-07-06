const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const Company = require('../models/Company');
const Interview = require('../models/Interview');
const Bookmark = require('../models/Bookmark');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get dashboard analytics for Students
// @route   GET /api/analytics/student
// @access  Private (Student only)
exports.getStudentAnalytics = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found', 404));
    }

    // 1. Aggregate Application Status Counts
    const statusStats = await Application.aggregate([
      { $match: { student: student._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format stats as a key-value dictionary: { Applied: 5, Offered: 1 }
    const applicationStats = {
      Applied: 0,
      Shortlisted: 0,
      Interviewing: 0,
      Offered: 0,
      Rejected: 0,
      Withdrawn: 0,
    };
    statusStats.forEach((stat) => {
      applicationStats[stat._id] = stat.count;
    });

    // 2. Count Saved Bookmarks
    const bookmarksCount = await Bookmark.countDocuments({ student: student._id });

    // 3. Count Upcoming Interviews
    const interviewsCount = await Interview.countDocuments({
      student: student._id,
      scheduledTime: { $gte: new Date() },
      status: 'Scheduled',
    });

    // 4. Fetch the next scheduled interview details
    const nextInterview = await Interview.findOne({
      student: student._id,
      scheduledTime: { $gte: new Date() },
      status: 'Scheduled',
    })
      .populate('job', 'title')
      .populate({ path: 'job', populate: { path: 'company', select: 'name logo' } })
      .sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      data: {
        applicationStats,
        bookmarksCount,
        interviewsCount,
        nextInterview,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics for Recruiters
// @route   GET /api/analytics/recruiter
// @access  Private (Recruiter only)
exports.getRecruiterAnalytics = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user.id });
    if (!recruiter) {
      return next(new ErrorResponse('Recruiter profile not found', 404));
    }

    // 1. Get job postings IDs posted by this recruiter user
    const jobs = await Job.find({ postedBy: req.user.id });
    const jobIds = jobs.map((job) => job._id);

    // 2. Aggregate status counts of applications for these jobs
    const applicationStats = {
      Applied: 0,
      Shortlisted: 0,
      Interviewing: 0,
      Offered: 0,
      Rejected: 0,
      Withdrawn: 0,
    };
    let totalApplications = 0;

    if (jobIds.length > 0) {
      const stats = await Application.aggregate([
        { $match: { job: { $in: jobIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      stats.forEach((stat) => {
        applicationStats[stat._id] = stat.count;
        totalApplications += stat.count;
      });
    }

    // 3. Count Upcoming Interviews scheduled by this recruiter
    const upcomingInterviewsCount = await Interview.countDocuments({
      interviewer: req.user.id,
      scheduledTime: { $gte: new Date() },
      status: 'Scheduled',
    });

    res.status(200).json({
      success: true,
      data: {
        totalJobsPosted: jobs.length,
        totalApplications,
        applicationStats,
        upcomingInterviewsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics for College Administrators
// @route   GET /api/analytics/admin
// @access  Private (Admin only)
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Core Platform Counts
    const totalStudents = await Student.countDocuments();
    const totalRecruiters = await Recruiter.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();

    // 2. Compute Placement Statistics
    // Query total students who have at least one application marked as 'Offered'
    const placedStudentsCount = await Application.distinct('student', { status: 'Offered' });
    const totalPlaced = placedStudentsCount.length;
    const placementRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) : 0;

    // 3. Aggregate Placements by Department
    const departmentBreakdown = await Application.aggregate([
      { $match: { status: 'Offered' } },
      // Join Student profile to get department
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentProfile',
        },
      },
      { $unwind: '$studentProfile' },
      {
        $group: {
          _id: '$studentProfile.department',
          placedCount: { $sum: 1 },
        },
      },
      { $project: { department: '$_id', placedCount: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          students: totalStudents,
          recruiters: totalRecruiters,
          companies: totalCompanies,
          jobs: totalJobs,
        },
        placement: {
          totalPlaced,
          placementRatePercentage: placementRate,
          departmentBreakdown,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
