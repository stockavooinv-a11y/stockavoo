import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * AUTHENTICATION MIDDLEWARE
 *
 * This middleware protects routes that require authentication.
 * It runs before the controller and verifies the JWT token.
 *
 * Usage in routes:
 * router.get('/protected', protect, controllerFunction);
 */

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in Authorization header
    // Format: "Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to access this resource.'
      });
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    // 4. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 5. Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // 6. Grant access to protected route
    // Attach user to request object so controllers can access it
    req.user = user;
    next(); // Move to next middleware/controller

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

/**
 * Restrict access to specific roles
 * @param  {...String} roles - Allowed roles (e.g., 'owner', 'manager')
 *
 * Usage:
 * router.delete('/users/:id', protect, restrictTo('owner', 'manager'), deleteUser);
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is set by protect middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

/**
 * Check if email is verified
 * Use this for routes that require email verification
 */
export const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      status: 'error',
      message: 'Please verify your email to access this resource'
    });
  }
  next();
};
