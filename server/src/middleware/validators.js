import { body, validationResult } from 'express-validator';

/**
 * VALIDATION MIDDLEWARE
 *
 * This middleware validates incoming requests before they reach controllers.
 * Benefits:
 * 1. Clear, specific error messages for users
 * 2. Validation logic separated from business logic
 * 3. Reusable validation rules
 * 4. Consistent error format
 *
 * How it works:
 * 1. Define validation rules using express-validator
 * 2. Add rules as middleware before controller
 * 3. If validation fails, send error response
 * 4. If validation passes, continue to controller
 */

/**
 * Validation rule for password strength
 * Requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
 */
const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least 1 uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least 1 lowercase letter')
  .matches(/\d/)
  .withMessage('Password must contain at least 1 number')
  .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
  .withMessage('Password must contain at least 1 symbol (!@#$%^&*()_+-=[]{};\'":|,.<>?/)');

/**
 * Registration validation rules
 */
export const validateRegistration = [
  // Full Name validation
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),

  // Email validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(), // Converts to lowercase and trims

  // Password validation
  passwordValidation,

  // Confirm Password validation
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  // Phone Number validation
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s()-]{10,}$/)
    .withMessage('Please provide a valid phone number'),

  // Terms agreement validation
  body('agreedToTerms')
    .notEmpty()
    .withMessage('You must agree to the terms and conditions')
    .isBoolean()
    .withMessage('Terms agreement must be a boolean value')
    .custom((value) => {
      if (value !== true) {
        throw new Error('You must agree to the terms and conditions to register');
      }
      return true;
    }),

  // Handle validation results
  handleValidationErrors
];

/**
 * Login validation rules
 */
export const validateLogin = [
  // Email validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  // Password validation (just check if exists, not strength for login)
  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  // Handle validation results
  handleValidationErrors
];

/**
 * Email validation for resend verification
 */
export const validateEmail = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  handleValidationErrors
];

/**
 * Middleware to handle validation errors
 * This runs after validation rules and checks if any errors occurred
 */
function handleValidationErrors(req, res, next) {
  // Get validation errors from request
  const errors = validationResult(req);

  // If there are no errors, continue to next middleware/controller
  if (errors.isEmpty()) {
    return next();
  }

  // Format errors into a user-friendly structure
  const formattedErrors = errors.array().map(error => ({
    field: error.path, // Which field has the error (e.g., 'email', 'password')
    message: error.msg // The error message
  }));

  // Extract just the messages for a simpler error list
  const errorMessages = formattedErrors.map(err => err.message);

  // Send error response with detailed information
  return res.status(400).json({
    status: 'error',
    message: 'Validation failed',
    errors: errorMessages, // Array of error messages
    details: formattedErrors // Detailed errors with field names (useful for forms)
  });
}

/**
 * Example error response format:
 * {
 *   "status": "error",
 *   "message": "Validation failed",
 *   "errors": [
 *     "Email is required",
 *     "Password must be at least 8 characters long"
 *   ],
 *   "details": [
 *     { "field": "email", "message": "Email is required" },
 *     { "field": "password", "message": "Password must be at least 8 characters long" }
 *   ]
 * }
 */
