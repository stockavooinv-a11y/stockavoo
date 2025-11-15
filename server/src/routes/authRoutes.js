import express from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  getMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateEmail
} from '../middleware/validators.js';

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
