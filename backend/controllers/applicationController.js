const Application = require('../models/Application');
const Job = require('../models/Job');
const Student = require('../models/Student');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Submit job application
// @route   POST /api/applications
// @access  Private (Student only)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, resumeId, answers } = req.body;

    if (!jobId) {
      return next(new ErrorResponse('Please provide a jobId', 400));
    }

    // 1. Fetch Student Profile
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found. Please complete profile details first.', 400));
    }

    // 2. Fetch Job Details
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorResponse(`Job opportunity not found with ID: ${jobId}`, 404));
    }

    // Check if Job is Active
    if (job.status !== 'Active') {
      return next(new ErrorResponse('This job listing is no longer active or accepting applications', 400));
    }

    // Check if deadline has passed
    if (new Date(job.deadline) < new Date()) {
      return next(new ErrorResponse('The application deadline for this job has passed', 400));
    }

    // 3. Check if student already applied
    const alreadyApplied = await Application.findOne({ job: jobId, student: student._id });
    if (alreadyApplied) {
      return next(new ErrorResponse('You have already applied for this job opportunity', 400));
    }

    // 4. Validate Student Eligibility
    const { minCgpa, allowedDepartments } = job.eligibilityCriteria;
    
    // CGPA Validation
    if (minCgpa && student.cgpa < minCgpa) {
      return next(
        new ErrorResponse(
          `Eligibility check failed: Minimum CGPA required is ${minCgpa}, your CGPA is ${student.cgpa}`,
          400
        )
      );
    }

    // Department Validation
    if (allowedDepartments && allowedDepartments.length > 0) {
      if (!allowedDepartments.includes(student.department)) {
        return next(
          new ErrorResponse(
            `Eligibility check failed: Only students from ${allowedDepartments.join(', ')} departments can apply. Your department is ${student.department}`,
            400
          )
        );
      }
    }

    // 5. Check Resume
    let finalResumeId = resumeId;
    if (!finalResumeId) {
      // Find default resume
      const defaultResume = await Resume.findOne({ student: student._id, isDefault: true });
      if (!defaultResume) {
        return next(
          new ErrorResponse(
            'Please upload a resume and mark it as default, or select a resume during submission.',
            400
          )
        );
      }
      finalResumeId = defaultResume._id;
    } else {
      const resumeExists = await Resume.findOne({ _id: finalResumeId, student: student._id });
      if (!resumeExists) {
        return next(new ErrorResponse(`Resume not found with ID: ${finalResumeId}`, 404));
      }
    }

    // 6. Create Application
    const application = await Application.create({
      job: jobId,
      student: student._id,
      resume: finalResumeId,
      answers: answers || [],
    });

    // 7. Send Confirmation Notification to Candidate
    await Notification.create({
      recipient: req.user.id,
      title: 'Application Submitted',
      message: `Your application for "${job.title}" has been successfully submitted!`,
      type: 'ApplicationStatus',
      relatedEntity: {
        entityId: application._id,
        entityType: 'Application',
      },
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's application history
// @route   GET /api/applications/my-applications
// @access  Private (Student only)
exports.getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found', 404));
    }

    const applications = await Application.find({ student: student._id })
      .populate({
        path: 'job',
        select: 'title jobType workMode location eligibilityCriteria',
        populate: {
          path: 'company',
          select: 'name logo industry',
        },
      })
      .populate('resume', 'fileName fileUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job posting
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter / Admin only)
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return next(new ErrorResponse(`Job listing not found with ID: ${req.params.jobId}`, 404));
    }

    // Security Check: Only the recruiter who posted the job or an admin can access candidates
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You are not authorized to view applications for this job', 403));
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('student')
      .populate('resume', 'fileName fileUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Pipeline management)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Admin only)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;

    if (!status) {
      return next(new ErrorResponse('Please provide a status value', 400));
    }

    const application = await Application.findById(req.params.id)
      .populate('student')
      .populate('job', 'title postedBy');

    if (!application) {
      return next(new ErrorResponse(`Application not found with ID: ${req.params.id}`, 404));
    }

    // Security Check: Only recruiter who posted the job or admin can update status
    if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update status on this application', 403));
    }

    // Save status change (pre-save timeline hook will push logging event)
    application.status = status;
    if (req.body.feedback) {
      application.feedback = req.body.feedback;
    }
    
    // Save application details (pushes to timeline subdocument)
    await application.save();

    // Trigger Notification for Candidate
    // Retrieve candidate user id from Student profile
    const candidateProfile = await Student.findById(application.student._id);
    if (candidateProfile) {
      await Notification.create({
        recipient: candidateProfile.user,
        title: 'Application Status Update',
        message: `Your application status for "${application.job.title}" has been updated to: ${status}. Comment: ${comment || 'No comment provided.'}`,
        type: 'ApplicationStatus',
        relatedEntity: {
          entityId: application._id,
          entityType: 'Application',
        },
      });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
