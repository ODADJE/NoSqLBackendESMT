/**
 * Custom error class.
 * @class
 * @extends Error
 * @param {string} message - The error message.
 * @param {number} statusCode - The error status code.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
