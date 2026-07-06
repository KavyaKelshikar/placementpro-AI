const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient user reference is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null indicates a system-generated notification
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message body is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: {
        values: ['JobAlert', 'ApplicationStatus', 'InterviewScheduled', 'General', 'System'],
        message: '{VALUE} is not a valid notification type',
      },
    },
    relatedEntity: {
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      entityType: {
        type: String,
        enum: ['Job', 'Application', 'Interview', 'Company'],
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization:
// 1. Compound Index: Extremely common query where we fetch a user's unread notifications or sort all notifications by date.
//    Matches: Notification.find({ recipient: userId, isRead: false }).sort({ createdAt: -1 })
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
