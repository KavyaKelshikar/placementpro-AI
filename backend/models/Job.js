const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Recruiter who posted the job
      required: [true, 'Author user reference is required'],
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: {
        values: ['Full-time', 'Internship', 'Contract'],
        message: '{VALUE} is not a valid job type',
      },
    },
    workMode: {
      type: String,
      required: [true, 'Work mode is required'],
      enum: {
        values: ['On-site', 'Remote', 'Hybrid'],
        message: '{VALUE} is not a valid work mode',
      },
    },
    location: [
      {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
      },
    ],
    salaryRange: {
      min: {
        type: Number,
        min: [0, 'Salary cannot be negative'],
      },
      max: {
        type: Number,
        min: [0, 'Salary cannot be negative'],
      },
      currency: {
        type: String,
        default: 'INR',
      },
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    eligibilityCriteria: {
      minCgpa: {
        type: Number,
        default: 0,
        min: [0, 'CGPA eligibility cannot be negative'],
        max: [10, 'CGPA eligibility cannot exceed 10.0'],
      },
      allowedDepartments: [
        {
          type: String,
          enum: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MNC', 'OTHER'],
        },
      ], // Empty array indicates all departments are eligible
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'Deadline must be a date in the future',
      },
    },
    numberOfOpenings: {
      type: Number,
      default: 1,
      min: [1, 'Number of openings must be at least 1'],
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Closed'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization:
// 1. Compound index for dashboard queries listing active jobs sorted by creation date (avoiding in-memory sorts)
JobSchema.index({ status: 1, createdAt: -1 });

// 2. Compound index to quickly retrieve active jobs from a specific company
JobSchema.index({ company: 1, status: 1 });

// 3. Single index on deadline to allow cron jobs to query expired jobs or sort by closing dates
JobSchema.index({ deadline: 1 });

// 4. Text index for search functionality targeting titles, descriptions, and criteria
JobSchema.index(
  {
    title: 'text',
    description: 'text',
    requirements: 'text',
  },
  {
    weights: {
      title: 10,
      requirements: 3,
      description: 1,
    },
    name: 'JobSearchIndex',
  }
);

module.exports = mongoose.model('Job', JobSchema);
