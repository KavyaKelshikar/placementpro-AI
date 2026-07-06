const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Recruiter/Interviewer user account
      required: [true, 'Interviewer user reference is required'],
    },
    roundName: {
      type: String,
      required: [true, 'Round name is required (e.g. Technical Round 1, Managerial Round)'],
      trim: true,
    },
    scheduledTime: {
      type: Date,
      required: [true, 'Scheduled time is required'],
      validate: {
        validator: function (value) {
          // If rescheduled, scheduledTime can be updated, but new schedules should ideally be in the future
          return this.isModified('scheduledTime') ? value > new Date() : true;
        },
        message: 'Scheduled interview time must be in the future',
      },
    },
    durationMinutes: {
      type: Number,
      default: 30,
      min: [5, 'Duration cannot be less than 5 minutes'],
    },
    format: {
      type: String,
      required: [true, 'Interview format is required'],
      enum: {
        values: ['Online', 'Offline'],
        message: '{VALUE} is not a valid format. Must be Online or Offline',
      },
    },
    meetingLink: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid meeting URL link',
      ],
    },
    location: {
      type: String,
      trim: true, // For offline interviews (e.g. "Placement Cell, Seminar Hall-A")
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Rescheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    feedback: {
      rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
      },
      notes: {
        type: String,
        trim: true,
      },
      decision: {
        type: String,
        enum: ['Pass', 'Fail', 'Hold', 'Pending'],
        default: 'Pending',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization:
// 1. Compound Index: Student's interview calendar sorted by scheduled time
InterviewSchema.index({ student: 1, scheduledTime: 1 });

// 2. Compound Index: Interviewer's schedule/calendar sorted by scheduled time
InterviewSchema.index({ interviewer: 1, scheduledTime: 1 });

// 3. Compound Index: Queries getting interview rounds for a specific job application
InterviewSchema.index({ application: 1, status: 1 });

module.exports = mongoose.model('Interview', InterviewSchema);
