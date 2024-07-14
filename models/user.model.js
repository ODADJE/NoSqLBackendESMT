const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [50, 'Name can not be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please add a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      trim: true,
      select: false,
      minLength: [8, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be user or admin',
      },
    },
    photo: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Hashes the password before saving it to the database.
 *
 * @param {string} next - The next function to be executed.
 */
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compares the given password with the stored hashed password of the user.
 *
 * @param {string} password - The password to compare.
 * @param {string} userPassword - The hashed password of the user.
 * @return {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
