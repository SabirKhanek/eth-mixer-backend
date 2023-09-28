/**
 * Middleware function that takes req, res, and next as parameters.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports = (req, res, next)=> {
    res.apiSuccess = (data, message = 'Success', statusCode = 200) => {
        res.status(statusCode).json({
          success: true,
          message,
          data,
          statusCode,
        });
      };

      res.apiError = (message = 'Error', statusCode = 500) => {
        res.status(statusCode).json({
          success: false,
          message,
          statusCode
        });
      };
    
      next()
}
