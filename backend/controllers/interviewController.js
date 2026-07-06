const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Student = require('../models/Student');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Schedule a candidate interview round
// @route   POST /api/interviews
// @access  Private (Recruiter / Admin only)
exports.scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, roundName, scheduledTime, durationMinutes, format, meetingLink, location } = req.body;

    if (!applicationId || !roundName || !scheduledTime || !format) {
      return next(new ErrorResponse('Please provide applicationId, roundName, scheduledTime and format', 400));
    }

    // Load Application to get associated student & job
    const application = await Application.findById(applicationId).populate('job', 'title postedBy');
    if (!application) {
      return next(new ErrorResponse(`Application not found with ID: ${applicationId}`, 404));
    }

    // Security Check: Only the recruiter who posted the job or an admin can schedule
    if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You are not authorized to schedule interviews for this application', 403));
    }

    // Prepare scheduling params
    const interviewData = {
      application: applicationId,
      student: application.student,
      job: application.job._id,
      interviewer: req.user.id, // Recruiter is the interviewer
      roundName,
      scheduledTime,
      durationMinutes: durationMinutes || 30,
      format,
      meetingLink,
      location,
    };

    const interview = await Interview.create(interviewData);

    // Business Logic: Auto-advance Application status to 'Interviewing'
    application.status = 'Interviewing';
    await application.save();

    // Trigger Notification for Candidate
    const student = await Student.findById(application.student);
    if (student) {
      const modeDetails = format === 'Online' ? `Online Meeting Link: ${meetingLink || 'To be shared'}` : `Offline Venue Location: ${location || 'To be shared'}`;
      
      await Notification.create({
        recipient: student.user,
        title: 'Interview Scheduled',
        message: `An interview round "${roundName}" has been scheduled for "${application.job.title}". Date: ${new Date(scheduledTime).toLocaleString()}. Format: ${format}. ${modeDetails}`,
        type: 'InterviewScheduled',
        relatedEntity: {
          entityId: interview._id,
          entityType: 'Interview',
        },
      });
    }

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user-specific scheduled interviews list
// @route   GET /api/interviews/my-interviews
// @access  Private (Student / Recruiter / Admin)
exports.getMyInterviews = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.id });
      if (!student) {
        return next(new ErrorResponse('Student profile not found', 404));
      }
      query.student = student._id;
    } else if (req.user.role === 'recruiter') {
      query.interviewer = req.user.id;
    }

    // Admin role has no queries restrictions (loads all)
    const interviews = await Interview.find(query)
      .populate('student', 'firstName lastName rollNumber department cgpa')
      .populate({
        path: 'job',
        select: 'title',
        populate: { path: 'company', select: 'name logo' },
      })
      .populate('interviewer', 'email')
      .sort({ scheduledTime: 1 }); // Sort chronologically (closest interview first)

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record interview feedback and status
// @route   PUT /api/interviews/:id/feedback
// @access  Private (Recruiter / Admin only)
exports.recordFeedback = async (req, res, next) => {
  try {
    const { rating, notes, decision, status } = req.body;

    let interview = await Interview.findById(req.params.id)
      .populate('job', 'title')
      .populate('student');
      
    if (!interview) {
      return next(new ErrorResponse(`Interview record not found with ID: ${req.params.id}`, 404));
    }

    // Security Check: Only the designated interviewer or an admin can update feedback
    if (interview.interviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You are not authorized to submit feedback for this interview', 403));
    }

    // Update feedback properties
    if (rating) interview.feedback.rating = rating;
    if (notes) interview.feedback.notes = notes;
    if (decision) interview.feedback.decision = decision;
    
    // Set status (defaults to Completed if decision submitted)
    interview.status = status || 'Completed';

    await interview.save();

    // Trigger Notification for Candidate (notifying feedback review, but keeping details private if needed)
    if (interview.student) {
      await Notification.create({
        recipient: interview.student.user,
        title: 'Interview Outcome Logged',
        message: `Feedback has been recorded for your interview round "${interview.roundName}" for "${interview.job.title}". Decision: ${decision || 'Pending'}`,
        type: 'InterviewScheduled',
        relatedEntity: {
          entityId: interview._id,
          entityType: 'Interview',
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback recorded successfully',
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};
