const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const fields = err.errors.map((e) => e.path).join(', ');
    message = `Duplicate value for '${fields}'. Please use another value.`;
    statusCode = 409;
    details = err.errors;
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = 'Validation failed';
    details = errors;
    statusCode = 422;
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    message = 'Referenced resource does not exist.';
    statusCode = 400;
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    message = `Database error: ${err.message}`;
    statusCode = 500;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid authentication token';
    statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Authentication token expired';
    statusCode = 401;
  }

  if (process.env.NODE_ENV === 'development') {
    logger.error(`${statusCode} ${message}`, err.stack);
  } else {
    logger.error(`${statusCode} ${message}`);
  }

  const response = {
    success: false,
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = globalErrorHandler;
