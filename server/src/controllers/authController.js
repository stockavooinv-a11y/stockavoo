import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../utils/emailHelpers.js';
import crypto from 'crypto';

/**
 * AUTHENTICATION CONTROLLER
 *
 * This file contains all the logic for user authentication:
 * - Registration
 * - Login
 * - Email verification
 * - Password reset
 *
 * Each function follows this pattern:
 * 1. Extract data from request (req.body, req.params, etc.)
 * 2. Validate data
 * 3. Perform database operations
 * 4. Send response to client
 */

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public (anyone can access)
 */
export const register = async (req, res) => {
  try {
    // 1. Extract data from request body
    // Note: Validation is handled by middleware, so data is already validated
    const { fullName, email, password, phoneNumber, agreedToTerms } = req.body;

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // 3. Create new user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password, // Will be hashed automatically by mongoose middleware
      phoneNumber,
      agreedToTerms
    });

    // 4. Generate email verification token
    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    // 5. Send verification email
    await sendVerificationEmail(user, verificationToken);

    // 6. Generate JWT token for immediate login (optional - you can skip this if you want users to verify first)
    const token = generateToken(user._id);

    // 7. Send success response
    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified
        },
        token // JWT token for authentication
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Generic error response
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during registration. Please try again.'
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    // 1. Extract credentials from request
    // Note: Validation is handled by middleware
    const { email, password } = req.body;

    // 2. Find user by email (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // 3. Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // 4. Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // 5. Update last login timestamp
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // 6. Generate JWT token
    const token = generateToken(user._id);

    // 7. Send success response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during login. Please try again.'
    });
  }
};

/**
 * @desc    Verify email with token
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  try {
    // 1. Get token from URL parameter
    const { token } = req.params;

    // 2. Hash the token (tokens are stored hashed in database)
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // 3. Find user with this token that hasn't expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() } // Token must not be expired
    });

    // 4. Check if token is valid
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token'
      });
    }

    // 5. Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // 6. Send welcome email
    await sendWelcomeEmail(user);

    // 7. Send success response
    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully! You can now login.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during email verification. Please try again.'
    });
  }
};

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
export const resendVerification = async (req, res) => {
  try {
    // Email validation is handled by middleware
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email'
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'This email is already verified'
      });
    }

    // Generate new token
    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.status(200).json({
      status: 'success',
      message: 'Verification email sent! Please check your inbox.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again.'
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private (requires authentication)
 */
export const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not retrieve user profile'
    });
  }
};

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate password reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send password reset email
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() } // Token must not be expired
    });

    // Check if token is valid
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'This link has expired or is invalid. Please request a new password reset.'
      });
    }

    // Update password and clear reset token fields
    user.password = password; // Will be hashed by mongoose middleware
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new JWT token for immediate login
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful! You can now login with your new password.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }
};

/**
 * @desc    Setup password for invited user (first-time login)
 * @route   POST /api/auth/setup-password/:token
 * @access  Public
 */
export const setupPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid setup token
    const user = await User.findOne({
      passwordSetupToken: hashedToken,
      passwordSetupExpires: { $gt: Date.now() } // Token must not be expired
    });

    // Check if token is valid
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'This setup link has expired or is invalid. Please contact your administrator.'
      });
    }

    // Set password and mark as verified
    user.password = password; // Will be hashed by mongoose middleware
    user.passwordSetupToken = undefined;
    user.passwordSetupExpires = undefined;
    user.isFirstLogin = false;
    user.isVerified = true; // Auto-verify on password setup
    await user.save();

    // Generate JWT token for immediate login
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Account setup successful! You can now login.',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Setup password error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }
};

