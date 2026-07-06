const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');

// Ensure uploads directory exists on start
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`
    );
  },
});

// Restrict file formats to PDF and Word documents
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /pdf|doc|docx/;
  
  const isMimeTypeValid = allowedExtensions.test(file.mimetype) || 
    file.mimetype === 'application/pdf' || 
    file.mimetype === 'application/msword' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
  const isExtValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeValid && isExtValid) {
    return cb(null, true);
  }
  cb(new ErrorResponse('File format invalid. Only PDF, DOC, and DOCX documents are allowed.', 400), false);
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

module.exports = upload;
