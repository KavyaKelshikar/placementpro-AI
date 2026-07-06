const Bookmark = require('../models/Bookmark');
const Student = require('../models/Student');
const Job = require('../models/Job');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Toggle Bookmark (Save/Unsave a Job opportunity)
// @route   POST /api/bookmarks/toggle
// @access  Private (Student only)
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return next(new ErrorResponse('Please provide a jobId', 400));
    }

    // Load Student profile
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found. Complete profile details first.', 404));
    }

    // Verify Job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorResponse(`Job posting not found with ID: ${jobId}`, 404));
    }

    // Check if bookmark already exists
    const bookmark = await Bookmark.findOne({ student: student._id, job: jobId });

    if (bookmark) {
      // Unsave/Remove bookmark
      await bookmark.deleteOne();
      res.status(200).json({
        success: true,
        bookmarked: false,
        message: 'Job removed from bookmarks',
      });
    } else {
      // Save/Add bookmark
      await Bookmark.create({
        student: student._id,
        job: jobId,
      });
      res.status(201).json({
        success: true,
        bookmarked: true,
        message: 'Job added to bookmarks',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookmarked jobs of the candidate
// @route   GET /api/bookmarks
// @access  Private (Student only)
exports.getMyBookmarks = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found', 404));
    }

    const bookmarks = await Bookmark.find({ student: student._id })
      .populate({
        path: 'job',
        select: 'title jobType workMode location deadline status salaryRange',
        populate: {
          path: 'company',
          select: 'name logo industry',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};
