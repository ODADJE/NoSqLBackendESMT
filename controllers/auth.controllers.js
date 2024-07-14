const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { polishUserToSend } = require("./user.controllers");

/**
 * Generates a JWT token for the given user.
 *
 * @param {Object} user - The user object to be included in the token.
 * @return {string} The generated JWT token.
 */
const createToken = (user) => {
  console.log(user);
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Sends a JSON response with the given user data and status code.
 *
 * @param {Object} user - The user object to be included in the response.
 * @param {number} statusCode - The HTTP status code to be used in the response.
 * @param {Object} res - The response object.
 * @return {Object} The JSON response with the user data and status code.
 */
const sendUser = (user, statusCode, res) => {
  const token = createToken(user);
  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: polishUserToSend(user, "password", "updatedAt", "__v"),
    },
  });
};

/**
 * Checks if the user is logged in and sends a JSON response with the user data and status code.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} The JSON response with the user data and status code.
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  req.user = user;
  next();
});

/**
 * Checks if the user has the required role and sends a JSON response with the user data and status code.
 * @param {Array} roles - The roles that are allowed to access the route.
 * @return {Function} The middleware function that checks if the user has the required role.
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

/**
 * @desc    Sign up
 * @route   POST /api/users/signUp
 * @access  Public
 * @param {string} req - The request object.
 * @param {string} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} - A promise that resolves to an object with a status code and a message.
 */
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new AppError("User already exists", 400));
  const newUser = await User.create({
    name,
    email,
    password,
    role,
  });
  return sendUser(newUser, 201, res);
});

/**
 * @desc    Sign in
 * @route   POST /api/users/signIn
 * @access  Public
 * @param {string} req - The request object.
 * @param {string} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} - A promise that resolves to an object with a status code and a message.
 */
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  return sendUser(user, 200, res);
});

/**
 * @desc    Get current user
 * @route   GET /api/users/me
 * @access  Private
 * @param {string} req - The request object.
 * @param {string} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} - A promise that resolves to an object with a status code and a message.
 */
exports.me = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  return sendUser(user, 200, res);
});

/**
 * @desc    Change password
 * @route   POST /api/users/changePassword
 * @access  Private
 * @param {string} req - The request object.
 * @param {string} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} - A promise that resolves to an object with a status code and a message.
 */
exports.changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(oldPassword, user.password))) {
    return next(new AppError("Incorrect old password", 401));
  }
  user.password = newPassword;
  await user.save();
  return sendUser(user, 200, res);
});

/**
 * @desc    Forgot password
 * @route   POST /api/users/forgotPassword
 * @access  Public
 * @param {string} req - The request object.
 * @param {string} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} - A promise that resolves to an object with a status code and a message.
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("No user with this email", 404));
  user.password = req.body.password;
  await user.save();
  return sendUser(user, 200, res);
});
