const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const config = require('../config');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError('User no longer exists or is deactivated.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token. Please log in again.', 401));
    }
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(`Role '${req.user?.role}' is not authorized to access this resource.`, 403)
      );
    }
    next();
  };
};

// Middleware to check if user is a creator (has influencerData)
const authorizeCreator = (req, res, next) => {
  if (!req.user || !req.user.influencerData) {
    return next(
      new AppError('Only Dining Creators can access this resource.', 403)
    );
  }
  next();
};

// Middleware to allow specific roles OR creators
const authorizeRolesOrCreator = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    // Allow if user has one of the specified roles OR is a creator
    if (roles.includes(req.user.role) || req.user.influencerData) {
      return next();
    }
    return next(
      new AppError('You do not have permission to access this resource.', 403)
    );
  };
};

module.exports = { protect, authorize, authorizeCreator, authorizeRolesOrCreator };
