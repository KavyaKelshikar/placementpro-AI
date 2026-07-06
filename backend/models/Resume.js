const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Associated student profile is required'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Resume file URL is required'],
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid document file URL',
      ],
    },
    parsedContent: {
      skills: [
        {
          type: String,
          trim: true,
        },
      ],
      education: [
        {
          type: String,
          trim: true,
        },
      ],
      experience: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to guarantee only one resume is marked default per student
ResumeSchema.pre('save', async function (next) {
  if (this.isModified('isDefault') && this.isDefault) {
    try {
      // Set all other resumes of this student to false
      await this.constructor.updateMany(
        { student: this.student, _id: { $ne: this._id } },
        { $set: { isDefault: false } }
      );
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Indexes for query optimization:
// 1. Single-field index on student to quickly load all resumes uploaded by a student
ResumeSchema.index({ student: 1 });

// 2. Compound index to quickly fetch the default resume of a student
ResumeSchema.index({ student: 1, isDefault: 1 });

module.exports = mongoose.model('Resume', ResumeSchema);
