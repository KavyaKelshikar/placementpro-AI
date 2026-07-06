const express = require('express');
const {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  getStudentById,
  getStudents,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('student'), createStudentProfile);
router.get('/me', protect, authorize('student'), getStudentProfile);
router.put('/me', protect, authorize('student'), updateStudentProfile);
router.get('/:id', protect, authorize('recruiter', 'admin'), getStudentById);
router.get('/', protect, authorize('recruiter', 'admin'), getStudents);

module.exports = router;
