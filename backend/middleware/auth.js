const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes from unauthenticated users
exports.protect = async (req, res, next) => {
  let token;

  // Read JWT from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Ensure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route. Token missing.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'placementpro_jwt_secret_dev_2026');

    // Attach current user to the request object
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(new ErrorResponse('Authorized user account not found', 401));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route. Token invalid.', 401));
  }
};

// Grant access to specific user roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('User context missing. Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to perform this action`,
          403
        )
      );
    }
    next();
  };
};
