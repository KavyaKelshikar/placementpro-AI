const express = require('express');
const {
  scheduleInterview,
  getMyInterviews,
  recordFeedback,
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('recruiter', 'admin'), scheduleInterview);
router.get('/my-interviews', protect, getMyInterviews);
router.put('/:id/feedback', protect, authorize('recruiter', 'admin'), recordFeedback);

module.exports = router;
