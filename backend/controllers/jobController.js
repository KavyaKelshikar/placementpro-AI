const Job = require('../models/Job');
const Recruiter = require('../models/Recruiter');
const Student = require('../models/Student');
const ErrorResponse = require('../utils/errorResponse');
const { getSkillMatch } = require('../utils/pythonApi');

// @desc    Create/Post a new job opportunity
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res, next) => {
  try {
    // Look up current recruiter's profile
    const recruiter = await Recruiter.findOne({ user: req.user.id });
    
    if (!recruiter) {
      return next(new ErrorResponse('Please create a recruiter profile before posting jobs', 400));
    }

    // Business Logic Safeguard: Recruiters must be approved by the college admin to post
    if (!recruiter.isApprovedByAdmin) {
      return next(
        new ErrorResponse(
          'Your recruiter account is pending college administration approval. Access denied.',
          403
        )
      );
    }

    // Business Logic Safeguard: Recruiters must be linked to an active company profile
    if (!recruiter.company) {
      return next(
        new ErrorResponse(
          'Recruiter profile has no associated company. Please update recruiter details first.',
          400
        )
      );
    }

    // Auto-populate relationship keys
    req.body.company = recruiter.company;
    req.body.postedBy = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get/Search all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { search, company, jobType, workMode, location, department, minCgpa } = req.query;
    const query = { status: 'Active' }; // Defaults to listing active jobs

    // Filter by specific company ID
    if (company) {
      query.company = company;
    }
    
    // Filter by Job parameters
    if (jobType) {
      query.jobType = jobType;
    }
    if (workMode) {
      query.workMode = workMode;
    }
    if (location) {
      query.location = { $in: location.split(',').map(l => l.trim()) };
    }

    // Filter by candidate eligibility
    if (department) {
      // Find jobs that allow this department OR have allowedDepartments empty (meaning all)
      query.$or = [
        { 'eligibilityCriteria.allowedDepartments': { $in: [department] } },
        { 'eligibilityCriteria.allowedDepartments': { $size: 0 } },
      ];
    }
    if (minCgpa) {
      // Find jobs whose CGPA requirement is less than or equal to student's CGPA
      query['eligibilityCriteria.minCgpa'] = { $lte: parseFloat(minCgpa) };
    }

    // Text Search Title, description, and requirements
    if (search) {
      query.$text = { $search: search };
    }

    // Run query, populate company name and logo
    const jobs = await Job.find(query)
      .populate('company', 'name logo website industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo website industry description locations contactEmail')
      .populate('postedBy', 'email');

    if (!job) {
      return next(new ErrorResponse(`Job not found with ID: ${req.params.id}`, 404));
    }

    // Check for optional studentId to run live skill-matching
    let matchResults = null;
    const { studentId } = req.query;
    
    if (studentId) {
      const student = await Student.findById(studentId);
      if (student && job.requirements && job.requirements.length > 0) {
        const matchData = await getSkillMatch(student.skills || [], job.requirements);
        if (matchData.success) {
          matchResults = {
            matchPercentage: matchData.matchPercentage,
            matchedSkills: matchData.matchedSkills,
            missingSkills: matchData.missingSkills,
          };
        }
      }
    }

    res.status(200).json({
      success: true,
      data: job,
      match: matchResults,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job details
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter / Admin only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse(`Job not found with ID: ${req.params.id}`, 404));
    }

    // Security Check: Only the recruiter who posted the job or an admin can edit it
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ID ${req.user.id} is not authorized to edit this job posting`,
          403
        )
      );
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter / Admin only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ErrorResponse(`Job not found with ID: ${req.params.id}`, 404));
    }

    // Security Check: Only the recruiter who posted the job or an admin can delete it
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ID ${req.user.id} is not authorized to delete this job posting`,
          403
        )
      );
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
