/**
 * Error handling middleware for Express.
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
const errorHandler = (err, req, res, next) => {
    // Check if the error has a specific status code, otherwise default to 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;
  
    const errorResponse = {
      success: false,
      message: err.message || 'Internal Server Error',
      error: err.stack || null,
      statusCode,
    };
  
    console.error(err);
  
    res.status(statusCode).json(errorResponse);
};
  
module.exports = errorHandler;
  