const Recruiter = require('../models/Recruiter');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create recruiter profile
// @route   POST /api/recruiters
// @access  Private (Recruiter only)
exports.createRecruiterProfile = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    // Approval must come from admin, default to false
    req.body.isApprovedByAdmin = false;

    // Check if recruiter profile already exists
    const profileExists = await Recruiter.findOne({ user: req.user.id });
    if (profileExists) {
      return next(new ErrorResponse('Recruiter profile already exists for this user account', 400));
    }

    const recruiter = await Recruiter.create(req.body);

    res.status(201).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in recruiter profile
// @route   GET /api/recruiters/me
// @access  Private (Recruiter only)
exports.getRecruiterProfile = async (req, res, next) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user.id }).populate('company');
    if (!recruiter) {
      return next(new ErrorResponse('Recruiter profile not found. Please create one.', 404));
    }

    res.status(200).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/me
// @access  Private (Recruiter only)
exports.updateRecruiterProfile = async (req, res, next) => {
  try {
    let recruiter = await Recruiter.findOne({ user: req.user.id });
    if (!recruiter) {
      return next(new ErrorResponse('Recruiter profile not found. Please create one.', 404));
    }

    // Do not allow changing approval status or user mapping
    delete req.body.user;
    delete req.body.isApprovedByAdmin;

    recruiter = await Recruiter.findOneAndUpdate({ user: req.user.id }, req.body, {
      new: true,
      runValidators: true,
    }).populate('company');

    res.status(200).json({
      success: true,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject recruiter profile
// @route   PUT /api/recruiters/approve/:id
// @access  Private (Admin only)
exports.approveRecruiter = async (req, res, next) => {
  try {
    const { isApproved } = req.body; // Expect boolean in request body
    
    if (typeof isApproved !== 'boolean') {
      return next(new ErrorResponse('Please specify boolean approval status (isApproved)', 400));
    }

    const recruiter = await Recruiter.findByIdAndUpdate(
      req.params.id,
      { isApprovedByAdmin: isApproved },
      { new: true, runValidators: true }
    );

    if (!recruiter) {
      return next(new ErrorResponse(`Recruiter profile not found with ID: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: `Recruiter approved status set to: ${isApproved}`,
      data: recruiter,
    });
  } catch (error) {
    next(error);
  }
};
