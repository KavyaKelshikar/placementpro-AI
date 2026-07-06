const express = require('express');
const {
  createRecruiterProfile,
  getRecruiterProfile,
  updateRecruiterProfile,
  approveRecruiter,
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('recruiter'), createRecruiterProfile);
router.get('/me', protect, authorize('recruiter'), getRecruiterProfile);
router.put('/me', protect, authorize('recruiter'), updateRecruiterProfile);
router.put('/approve/:id', protect, authorize('admin'), approveRecruiter);

module.exports = router;
