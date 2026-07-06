const User = require('../models/User');
const Student = require('../models/Student');
const Recruiter = require('../models/Recruiter');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// Helper to sign JWT
const getSignedJwtToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'placementpro_jwt_secret_dev_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// Helper to format token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = getSignedJwtToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    // Validate inputs
    if (!email || !password || !role) {
      return next(new ErrorResponse('Please provide email, password and role', 400));
    }

    // Restrict Administrator registration to the main credentials
    if (role === 'admin' && email.toLowerCase() !== 'admin@placementpro.ai') {
      return next(new ErrorResponse('College Administrator registration is restricted to authorized accounts only.', 403));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already registered with this email', 400));
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
    });

    // Automatically create corresponding empty profile documents for seamless onboarding
    if (role === 'student') {
      const localPart = email.split('@')[0];
      const nameParts = localPart.split(/[\._\-]/);
      const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      const lastName = nameParts[1] ? (nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)) : 'User';

      await Student.create({
        user: user._id,
        firstName,
        lastName,
        rollNumber: `CS${Date.now().toString().slice(-6)}`,
        department: 'CSE',
        batch: '2022-2026',
        cgpa: 8.0,
        skills: [],
      });
    } else if (role === 'recruiter') {
      const localPart = email.split('@')[0];
      const nameParts = localPart.split(/[\._\-]/);
      const firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      const lastName = nameParts[1] ? (nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)) : 'HR';

      await Recruiter.create({
        user: user._id,
        firstName,
        lastName,
        jobTitle: 'Hiring Specialist',
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check for user (include password in selection)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user and profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ user: user._id });
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ user: user._id }).populate('company');
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
