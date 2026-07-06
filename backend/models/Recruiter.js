const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Associated user account is required'],
      unique: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null, // Can be null if the recruiter has not yet joined/created a company
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        'Please provide a valid phone number (E.164 format, e.g., +1234567890)',
      ],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title/designation is required (e.g. HR Lead, Tech Recruiter)'],
      trim: true,
    },
    isApprovedByAdmin: {
      type: Boolean,
      default: false, // Recruiters must be approved by the college admin to post jobs
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for full name
RecruiterSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for query optimization:
// 1. Single field index on company to quickly query all recruiters affiliated with a specific company
RecruiterSchema.index({ company: 1 });

// 2. Index on approval status for admin dashboards
RecruiterSchema.index({ isApprovedByAdmin: 1 });

module.exports = mongoose.model('Recruiter', RecruiterSchema);
