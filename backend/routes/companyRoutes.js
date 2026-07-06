const express = require('express');
const {
  createCompany,
  getCompanies,
  getCompanyBySlug,
  getCompanyById,
  updateCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('recruiter', 'admin'), createCompany);
router.get('/', getCompanies);
router.get('/:slug', getCompanyBySlug);
router.get('/id/:id', getCompanyById);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateCompany);

module.exports = router;
