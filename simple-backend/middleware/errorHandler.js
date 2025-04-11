/**
 * Error handling middleware for the Express server
 * Provides consistent error responses and logging
 */

// Create timestamp for errors
const getTimestamp = () => {
  return new Date().toISOString();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error details
  console.error(`[ERROR ${getTimestamp()}]`, err);
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  // Default error status
  const statusCode = err.statusCode || 500;
  
  // Create error response
  const errorResponse = {
    status: 'error',
    code: statusCode,
    message: err.message || 'An unexpected error occurred',
  };
  
  // Add stack trace in development mode only
  if (isDev && err.stack) {
    errorResponse.stack = err.stack;
    errorResponse.details = err.details || null;
  }
  
  // Send the error response
  res.status(statusCode).json(errorResponse);
};

// 404 Not Found middleware
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
