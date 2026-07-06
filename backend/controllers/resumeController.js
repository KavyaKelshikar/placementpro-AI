const Resume = require('../models/Resume');
const Student = require('../models/Student');
const ErrorResponse = require('../utils/errorResponse');
const { analyzeResume } = require('../utils/pythonApi');
const fs = require('fs');
const path = require('path');

// @desc    Upload a new resume file
// @route   POST /api/resumes
// @access  Private (Student only)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Verify student profile exists
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      // Clean up uploaded file if student profile doesn't exist
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return next(
        new ErrorResponse(
          'Student profile not found. Create a profile before uploading resumes.',
          400
        )
      );
    }

    // Determine if this is the student's first resume
    const resumeCount = await Resume.countDocuments({ student: student._id });
    const isDefault = resumeCount === 0;

    // Build public access URL (relative route served statically)
    const fileUrl = `/uploads/${req.file.filename}`;

    const resume = await Resume.create({
      student: student._id,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      isDefault: isDefault,
    });

    // Call Python AI Service for Resume analysis and text extraction
    const absolutePath = req.file.path;
    const analysis = await analyzeResume(absolutePath);

    let parsedResults = null;

    if (analysis.success) {
      resume.parsedContent = {
        skills: analysis.skills || [],
        education: [],
        experience: [],
      };
      await resume.save();

      // Automatically sync parsed skills with student profile if not already present
      if (analysis.skills && analysis.skills.length > 0) {
        const existingSkills = student.skills || [];
        const mergedSkills = [...new Set([...existingSkills, ...analysis.skills])];
        student.skills = mergedSkills;
        await student.save();
      }

      parsedResults = {
        score: analysis.score,
        suggestions: analysis.suggestions,
        skillsMatched: analysis.skills,
      };
    }

    res.status(201).json({
      success: true,
      data: resume,
      analysis: parsedResults,
    });
  } catch (error) {
    // Ensure file gets deleted on code error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Get all resumes of current student
// @route   GET /api/resumes
// @access  Private (Student only)
exports.getMyResumes = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found', 404));
    }

    const resumes = await Resume.find({ student: student._id });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default resume for student applications
// @route   PUT /api/resumes/:id/default
// @access  Private (Student only)
exports.setDefaultResume = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found', 404));
    }

    let resume = await Resume.findOne({ _id: req.params.id, student: student._id });
    if (!resume) {
      return next(new ErrorResponse(`Resume not found with ID: ${req.params.id}`, 404));
    }

    // Setting isDefault = true triggers pre-save hook that sets others to false
    resume.isDefault = true;
    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Default resume updated successfully',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume file and model document
// @route   DELETE /api/resumes/:id
// @access  Private (Student only)
exports.deleteResume = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return next(new ErrorResponse('Student profile not found', 404));
    }

    const resume = await Resume.findOne({ _id: req.params.id, student: student._id });
    if (!resume) {
      return next(new ErrorResponse(`Resume not found with ID: ${req.params.id}`, 404));
    }

    // Try deleting physical file on disk
    const filename = path.basename(resume.fileUrl);
    const filepath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Check if we deleted the default resume and if we should promote another
    const wasDefault = resume.isDefault;
    await resume.deleteOne();

    if (wasDefault) {
      // Find another resume and promote it to default
      const alternateResume = await Resume.findOne({ student: student._id });
      if (alternateResume) {
        alternateResume.isDefault = true;
        await alternateResume.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
