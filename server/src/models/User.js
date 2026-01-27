import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import crypto from 'crypto';

/**
 * USER MODEL
 *
 * This defines the structure of a User document in MongoDB.
 * Think of it as a table schema in SQL, but more flexible.
 *
 * Key concepts:
 * - Schema: Defines the structure and validation rules
 * - Model: The constructor function for creating documents
 * - Document: An instance of a model (actual user data)
 */

const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true, // Removes whitespace from both ends
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    // Email address - must be unique
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true, // No two users can have same email
      lowercase: true, // Converts to lowercase before saving
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },

    // Phone number
    phoneNumber: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
      validate: {
        validator: function(v) {
          // Basic phone validation - adjust regex based on your needs
          return /^[+]?[\d\s()-]{10,}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },

    // Password - will be hashed before saving
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // This field won't be returned in queries by default (security)
    },

    // Role - default is 'owner' since everyone who registers is a business owner
    role: {
      type: String,
      enum: ['owner', 'manager', 'staff'], // Only these values are allowed
      default: 'owner'
    },

    // Account verification status
    isVerified: {
      type: Boolean,
      default: false
    },

    // Email verification token (sent to user's email)
    verificationToken: String,
    verificationTokenExpires: Date,

    // Password reset functionality (for "Forgot Password")
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Profile picture URL (user upload)
    profilePicture: String,

    // Account status
    isActive: {
      type: Boolean,
      default: true
    },

    // Terms and conditions acceptance
    agreedToTerms: {
      type: Boolean,
      required: [true, 'You must agree to the terms and conditions'],
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'You must agree to the terms and conditions'
      }
    },

    // Last login timestamp
    lastLogin: Date
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true
  }
);

// ============ INDEXES ============
// Indexes speed up queries - like an index in a book
userSchema.index({ email: 1 });

// ============ MIDDLEWARE - RUNS BEFORE SAVING ============
/**
 * Pre-save middleware
 * This runs automatically before a user document is saved to the database
 * We use it to hash the password
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt (random data added to password before hashing)
    // 12 is the "cost factor" - higher = more secure but slower
    const salt = await bcrypt.genSalt(12);

    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// ============ INSTANCE METHODS ============
/**
 * These are methods we can call on individual user documents
 * Example: user.comparePassword('myPassword123')
 */

/**
 * Compare entered password with hashed password in database
 * @param {String} candidatePassword - The password to check
 * @returns {Boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate email verification token
 * @returns {String} - The verification token (unhashed)
 */
userSchema.methods.createVerificationToken = function() {
  // Generate random token using crypto (built-in Node.js module)
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Hash the token before storing in database (security best practice)
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Token expires in 24 hours
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

  // Return unhashed token to send via email
  return verificationToken;
};

/**
 * Generate password reset token
 * @returns {String} - The reset token (unhashed)
 */
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 1 hour
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
