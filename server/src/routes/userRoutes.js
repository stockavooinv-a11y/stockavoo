import express from 'express';
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  updateOwnProfile,
  changePassword
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { requireRole, requirePermission, requireOwnership } from '../middleware/rbac.js';

const router = express.Router();

/**
 * USER MANAGEMENT ROUTES
 *
 * All routes require authentication (protect middleware)
 * Some routes have additional role-based restrictions
 */

// ========== PUBLIC (AUTHENTICATED) ROUTES ==========

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private (any authenticated user)
 */
router.get('/me', protect, getCurrentUser);

/**
 * @route   PUT /api/users/me
 * @desc    Update own profile
 * @access  Private (any authenticated user)
 */
router.put('/me', protect, updateOwnProfile);

/**
 * @route   PUT /api/users/me/password
 * @desc    Change own password
 * @access  Private (any authenticated user)
 */
router.put('/me/password', protect, changePassword);

// ========== OWNER/MANAGER ROUTES ==========

/**
 * @route   GET /api/users
 * @desc    Get all users in the business
 * @access  Private (Owner, Manager)
 */
router.get(
  '/',
  protect,
  requireRole(['owner', 'manager']),
  getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Owner, Manager, or Self)
 */
router.get(
  '/:id',
  protect,
  getUserById
);

// ========== OWNER-ONLY ROUTES ==========

/**
 * @route   POST /api/users
 * @desc    Create/Invite new user
 * @access  Private (Owner only)
 */
router.post(
  '/',
  protect,
  requireRole(['owner']),
  requirePermission('users', 'create'),
  createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (including role changes)
 * @access  Private (Owner for role changes, Self for basic info)
 */
router.put(
  '/:id',
  protect,
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete/Deactivate user
 * @access  Private (Owner only)
 */
router.delete(
  '/:id',
  protect,
  requireRole(['owner']),
  requirePermission('users', 'delete'),
  deleteUser
);

export default router;
