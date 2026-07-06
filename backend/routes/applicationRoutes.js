const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('student'), applyForJob);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
