/**
 * Catch asynchronous errors.
 * @param {Function} fn - The function to be executed.
 * @returns {Function} - The wrapped function.
 */
module.exports = function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
