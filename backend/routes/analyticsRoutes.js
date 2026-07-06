const express = require('express');
const {
  getStudentAnalytics,
  getRecruiterAnalytics,
  getAdminAnalytics,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/student', protect, authorize('student'), getStudentAnalytics);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
