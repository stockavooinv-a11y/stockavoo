import express from 'express';
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  bulkCreateStores,
} from '../controllers/storeController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

/**
 * STORE MANAGEMENT ROUTES
 *
 * All routes require authentication and owner role
 * Only business owners can manage stores
 */

/**
 * @route   GET /api/stores
 * @desc    Get all stores created by the logged-in user
 * @access  Private (Owner only)
 */
router.get(
  '/',
  protect,
  requireRole(['owner']),
  getAllStores
);

/**
 * @route   GET /api/stores/:id
 * @desc    Get single store by ID
 * @access  Private (Owner only)
 */
router.get(
  '/:id',
  protect,
  requireRole(['owner']),
  getStoreById
);

/**
 * @route   POST /api/stores/bulk
 * @desc    Create multiple stores in bulk
 * @access  Private (Owner only)
 */
router.post(
  '/bulk',
  protect,
  requireRole(['owner']),
  bulkCreateStores
);

/**
 * @route   POST /api/stores
 * @desc    Create new store
 * @access  Private (Owner only)
 */
router.post(
  '/',
  protect,
  requireRole(['owner']),
  createStore
);

/**
 * @route   PUT /api/stores/:id
 * @desc    Update store
 * @access  Private (Owner only)
 */
router.put(
  '/:id',
  protect,
  requireRole(['owner']),
  updateStore
);

/**
 * @route   DELETE /api/stores/:id
 * @desc    Delete/Deactivate store
 * @access  Private (Owner only)
 */
router.delete(
  '/:id',
  protect,
  requireRole(['owner']),
  deleteStore
);

export default router;
