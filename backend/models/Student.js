const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true,
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true,
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Field of study is required'],
    trim: true,
  },
  startYear: {
    type: Number,
    required: [true, 'Start year is required'],
  },
  endYear: {
    type: Number,
  },
  grade: {
    type: String,
    trim: true,
  },
});

const WorkExperienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
});

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  link: {
    type: String,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please provide a valid project URL',
    ],
  },
  technologies: [
    {
      type: String,
      trim: true,
    },
  ],
});

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Associated user account is required'],
      unique: true,
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
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MNC', 'OTHER'],
        message: '{VALUE} is not a valid department',
      },
    },
    batch: {
      type: String,
      required: [true, 'Batch year is required'],
      trim: true, // e.g., "2022-2026"
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [EducationSchema],
    experience: [WorkExperienceSchema],
    projects: [ProjectSchema],
    profilePhoto: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid image URL',
      ],
    },
    socialLinks: {
      github: {
        type: String,
        match: [/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/, 'Invalid GitHub URL'],
      },
      linkedin: {
        type: String,
        match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/, 'Invalid LinkedIn URL'],
      },
      portfolio: {
        type: String,
        match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Invalid Portfolio URL'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to get full name
StudentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Indexes for query optimization:
// 1. Compound index on department and batch for placement coordinators filtering candidates
StudentSchema.index({ department: 1, batch: 1 });

// 2. Compound index on cgpa for filtering eligible students for job applications
StudentSchema.index({ cgpa: -1 });

// 3. Text index for recruiter search (by skills, department, first name, last name)
StudentSchema.index(
  {
    firstName: 'text',
    lastName: 'text',
    skills: 'text',
    department: 'text',
  },
  {
    weights: {
      skills: 5,
      firstName: 3,
      lastName: 3,
      department: 1,
    },
    name: 'StudentSearchIndex',
  }
);

module.exports = mongoose.model('Student', StudentSchema);
