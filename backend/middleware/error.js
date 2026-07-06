const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development troubleshooting
  console.error('Error Intercepted:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const duplicateKey = Object.keys(err.keyValue || {}).join(', ');
    const message = `Duplicate value entered for field(s): ${duplicateKey || 'unique key'}. Please check input.`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error (ValidationError)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT Token Invalid
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authorization token. Access denied.';
    error = new ErrorResponse(message, 401);
  }

  // JWT Token Expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Authorization token has expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
