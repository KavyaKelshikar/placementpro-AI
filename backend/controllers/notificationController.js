const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user's notifications feed
// @route   GET /api/notifications
// @access  Private (All authenticated users)
exports.getNotifications = async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;
    const query = { recipient: req.user.id };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private (All authenticated users)
exports.markAsRead = async (req, res, next) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new ErrorResponse(`Notification not found with ID: ${req.params.id}`, 404));
    }

    // Security Check: Only the recipient can modify it
    if (notification.recipient.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to access this notification', 403));
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user's notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private (All authenticated users)
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private (All authenticated users)
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new ErrorResponse(`Notification not found with ID: ${req.params.id}`, 404));
    }

    // Security Check: Only the recipient can delete it
    if (notification.recipient.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this notification', 403));
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification removed successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
