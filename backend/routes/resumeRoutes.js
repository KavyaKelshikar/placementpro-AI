const express = require('express');
const {
  uploadResume,
  getMyResumes,
  setDefaultResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Mount multer middleware to validate and save incoming file field named 'resume'
router.post('/', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/', protect, authorize('student'), getMyResumes);
router.put('/:id/default', protect, authorize('student'), setDefaultResume);
router.delete('/:id', protect, authorize('student'), deleteResume);

module.exports = router;
