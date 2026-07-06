const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    trim: true,
  },
});

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Applied resume reference is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected', 'Withdrawn'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'Applied',
    },
    statusTimeline: [TimelineEventSchema],
    answers: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to automatically log status changes in the timeline history
ApplicationSchema.pre('save', function (next) {
  if (this.isModified('status') || this.isNew) {
    const comment = this.isNew
      ? 'Application successfully submitted.'
      : `Application status changed to: ${this.status}.`;

    this.statusTimeline.push({
      status: this.status,
      updatedAt: new Date(),
      comment: comment,
    });
  }
  next();
});

// Indexes for query optimization:
// 1. UNIQUE Compound Index: A student can only submit exactly ONE application per job
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

// 2. Compound Index: For recruiters filtering applications for a specific job by pipeline stage
ApplicationSchema.index({ job: 1, status: 1 });

// 3. Compound Index: For student dashboard queries fetching their application list grouped/sorted by status
ApplicationSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
