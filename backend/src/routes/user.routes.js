const express = require('express');
const { body, param, query } = require('express-validator');
const { userController } = require('../controllers');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateJWT);

/**
 * @route GET /api/users/:id
 * @desc Get user profile by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
  ],
  validateRequest,
  userController.getUserProfile
);

/**
 * @route PUT /api/users/:id
 * @desc Update user profile
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    body('firstName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('location')
      .optional()
      .isObject()
      .withMessage('Location must be an object'),
    body('location.coordinates')
      .optional()
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of [longitude, latitude]'),
    body('location.coordinates.*')
      .optional()
      .isFloat()
      .withMessage('Coordinates must be numbers')
  ],
  validateRequest,
  userController.updateUserProfile
);

/**
 * @route GET /api/users/:id/items
 * @desc Get user items
 * @access Private
 */
router.get(
  '/:id/items',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
  ],
  validateRequest,
  userController.getUserItems
);

/**
 * @route GET /api/users/:id/swaps
 * @desc Get user swaps
 * @access Private
 */
router.get(
  '/:id/swaps',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
  ],
  validateRequest,
  userController.getUserSwaps
);

/**
 * @route GET /api/users/:id/reviews
 * @desc Get user reviews
 * @access Private
 */
router.get(
  '/:id/reviews',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
  ],
  validateRequest,
  userController.getUserReviews
);

/**
 * @route GET /api/users/search
 * @desc Search users
 * @access Private
 */
router.get(
  '/search',
  [
    query('query')
      .notEmpty()
      .withMessage('Search query is required'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
  ],
  validateRequest,
  userController.searchUsers
);

/**
 * @route GET /api/users/nearby
 * @desc Get nearby users
 * @access Private
 */
router.get(
  '/nearby',
  [
    query('longitude')
      .isFloat()
      .withMessage('Longitude must be a number'),
    query('latitude')
      .isFloat()
      .withMessage('Latitude must be a number'),
    query('radius')
      .optional()
      .isFloat({ min: 0.1, max: 100 })
      .withMessage('Radius must be between 0.1 and 100 km')
  ],
  validateRequest,
  userController.getNearbyUsers
);

/**
 * @route GET /api/users/:id/impact
 * @desc Get user environmental impact
 * @access Private
 */
router.get(
  '/:id/impact',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID')
  ],
  validateRequest,
  userController.getUserImpact
);

module.exports = router;