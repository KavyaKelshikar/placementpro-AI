const Student = require('../models/Student');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create student profile
// @route   POST /api/students
// @access  Private (Student only)
exports.createStudentProfile = async (req, res, next) => {
  try {
    // Add user ID to request body
    req.body.user = req.user.id;

    // Check if student profile already exists
    const profileExists = await Student.findOne({ user: req.user.id });
    if (profileExists) {
      return next(new ErrorResponse('Student profile already exists for this user account', 400));
    }

    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in student profile
// @route   GET /api/students/me
// @access  Private (Student only)
exports.getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found. Please create one.', 404));
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/students/me
// @access  Private (Student only)
exports.updateStudentProfile = async (req, res, next) => {
  try {
    let student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found. Please create one.', 404));
    }

    // Do not allow changing the user link or roll number once set
    delete req.body.user;
    delete req.body.rollNumber;

    student = await Student.findOneAndUpdate({ user: req.user.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student profile by ID
// @route   GET /api/students/:id
// @access  Private (Recruiter/Admin only)
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'email');
    if (!student) {
      return next(new ErrorResponse(`Student profile not found with ID: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get/Search all student profiles
// @route   GET /api/students
// @access  Private (Recruiter/Admin only)
exports.getStudents = async (req, res, next) => {
  try {
    const { department, batch, minCgpa, search, skills } = req.query;
    const query = {};

    // Filters
    if (department) {
      query.department = department;
    }
    if (batch) {
      query.batch = batch;
    }
    if (minCgpa) {
      query.cgpa = { $gte: parseFloat(minCgpa) };
    }
    if (skills) {
      // skills query is comma-separated: e.g. "React,Node"
      const skillArray = skills.split(',').map(s => s.trim());
      query.skills = { $all: skillArray };
    }

    // Text search query
    if (search) {
      query.$text = { $search: search };
    }

    const students = await Student.find(query).populate('user', 'email');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};
