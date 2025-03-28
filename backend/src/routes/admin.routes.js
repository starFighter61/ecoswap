const express = require('express');
const { body, query } = require('express-validator');
const { adminController } = require('../controllers');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateJWT, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes in this file require authentication and admin privileges
router.use(authenticateJWT, isAdmin);

/**
 * @route GET /api/admin/stats
 * @desc Get system statistics
 * @access Admin
 */
router.get('/stats', adminController.getSystemStats);

/**
 * @route GET /api/admin/users
 * @desc Get all users (admin)
 * @access Admin
 */
router.get(
  '/users',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'username', 'firstName', 'lastName', 'rating.average'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  validateRequest,
  adminController.getAllUsers
);

/**
 * @route GET /api/admin/items
 * @desc Get all items (admin)
 * @access Admin
 */
router.get(
  '/items',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'title', 'category', 'condition', 'estimatedValue', 'views'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  validateRequest,
  adminController.getAllItems
);

/**
 * @route GET /api/admin/swaps
 * @desc Get all swaps (admin)
 * @access Admin
 */
router.get(
  '/swaps',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'status'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  validateRequest,
  adminController.getAllSwaps
);

/**
 * @route POST /api/admin/notifications/system
 * @desc Send system notification to all users
 * @access Admin
 */
router.post(
  '/notifications/system',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 500 })
      .withMessage('Message cannot exceed 500 characters')
  ],
  validateRequest,
  adminController.sendSystemNotification
);

module.exports = router;