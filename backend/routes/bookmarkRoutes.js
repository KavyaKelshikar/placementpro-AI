const express = require('express');
const {
  toggleBookmark,
  getMyBookmarks,
} = require('../controllers/bookmarkController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/toggle', protect, authorize('student'), toggleBookmark);
router.get('/', protect, authorize('student'), getMyBookmarks);

module.exports = router;
