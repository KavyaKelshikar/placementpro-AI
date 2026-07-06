const Company = require('../models/Company');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create/Register a new company
// @route   POST /api/companies
// @access  Private (Recruiter / Admin only)
exports.createCompany = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    // Check if company name already exists
    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      return next(new ErrorResponse('Company with this name already exists', 400));
    }

    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company profile by slug (for clean frontend URLs)
// @route   GET /api/companies/:slug
// @access  Public
exports.getCompanyBySlug = async (req, res, next) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) {
      return next(new ErrorResponse(`Company profile not found with slug: ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/id/:id
// @access  Public
exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return next(new ErrorResponse(`Company not found with ID: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile details
// @route   PUT /api/companies/:id
// @access  Private (Recruiter / Admin only)
exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);
    if (!company) {
      return next(new ErrorResponse(`Company not found with ID: ${req.params.id}`, 404));
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};
