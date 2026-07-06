const express = require('express');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('recruiter'), createJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
