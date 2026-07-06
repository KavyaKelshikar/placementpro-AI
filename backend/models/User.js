const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      required: [true, 'Please specify a user role'],
      enum: {
        values: ['student', 'recruiter', 'admin'],
        message: '{VALUE} is not a valid role. Allowed roles are: student, recruiter, admin',
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving if it is modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password entered by user with hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index optimization: Single-field index on email for quick authentication lookup.
// Mongoose creates this index automatically due to unique: true.

module.exports = mongoose.model('User', UserSchema);
