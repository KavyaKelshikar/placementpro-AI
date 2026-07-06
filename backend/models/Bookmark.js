const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student profile reference is required'],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
  },
  {
    timestamps: true, // Tracks when the job was bookmarked
  }
);

// Indexes for query optimization:
// 1. UNIQUE Compound Index: Prevents a student from bookmarking the same job multiple times.
//    Also enables high-performance queries for a student's bookmarks list.
BookmarkSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
