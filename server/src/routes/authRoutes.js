import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe,
  googleCallback,
  facebookCallback,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateEmail,
  validateForgotPassword,
  validateResetPassword
} from '../middleware/validators.js';
import passport from '../config/passport.js';

/**
 * AUTHENTICATION ROUTES
 *
 * This file defines all authentication-related endpoints.
 *
 * Route structure:
 * - Method: GET, POST, PUT, DELETE, etc.
 * - Path: /api/auth/...
 * - Middleware: Optional (protect, validate, etc.)
 * - Controller: The function that handles the request
 *
 * Example:
 * router.post('/register', register);
 *        │         │          │
 *        │         │          └─ Controller function
 *        │         └─ URL path
 *        └─ HTTP method
 */

const router = express.Router();

// ============ PUBLIC ROUTES (no authentication required) ============

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 *
 * Expected request body:
 * {
 *   "fullName": "John Doe",
 *   "email": "john@example.com",
 *   "password": "Password123!",
 *   "confirmPassword": "Password123!",
 *   "phoneNumber": "+1234567890",
 *   "agreedToTerms": true
 * }
 */
router.post('/register', validateRegistration, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 *
 * Expected request body:
 * {
 *   "email": "john@example.com",
 *   "password": "Password123!"
 * }
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email with token
 * @access  Public
 *
 * The token is sent to user's email after registration
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 *
 * Expected request body:
 * {
 *   "email": "john@example.com"
 * }
 */
router.post('/resend-verification', validateEmail, resendVerification);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset link
 * @access  Public
 *
 * Expected request body:
 * {
 *   "email": "john@example.com"
 * }
 */
router.post('/forgot-password', validateForgotPassword, forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 *
 * Expected request body:
 * {
 *   "password": "NewPassword123!",
 *   "confirmPassword": "NewPassword123!"
 * }
 */
router.post('/reset-password/:token', validateResetPassword, resetPassword);

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }), googleCallback);

/**
 * @route   GET /api/auth/facebook
 * @desc    Initiate Facebook OAuth flow
 * @access  Public
 */
router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));

/**
 * @route   GET /api/auth/facebook/callback
 * @desc    Facebook OAuth callback
 * @access  Public
 */
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }), facebookCallback);

// ============ PROTECTED ROUTES (authentication required) ============

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 *
 * Requires Authorization header with JWT token:
 * Authorization: Bearer <token>
 */
router.get('/me', protect, getMe);

export default router;
