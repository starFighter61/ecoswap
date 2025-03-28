const express = require('express');
const { body, param, query } = require('express-validator');
const { itemController } = require('../controllers');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateJWT, isResourceOwner } = require('../middleware/auth.middleware');
const { Item } = require('../models');

const router = express.Router();

/**
 * @route POST /api/items
 * @desc Create a new item
 * @access Private
 */
router.post(
  '/',
  authenticateJWT,
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('category')
      .isIn([
        'clothing',
        'electronics',
        'furniture',
        'books',
        'toys',
        'sports',
        'kitchen',
        'garden',
        'automotive',
        'other'
      ])
      .withMessage('Invalid category'),
    body('condition')
      .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
      .withMessage('Invalid condition'),
    body('images')
      .isArray({ min: 1 })
      .withMessage('At least one image is required'),
    body('images.*')
      .isURL()
      .withMessage('Image must be a valid URL'),
    body('estimatedValue')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Estimated value must be a positive number'),
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
  itemController.createItem
);

/**
 * @route GET /api/items
 * @desc Get all items with filtering
 * @access Public
 */
router.get(
  '/',
  [
    query('category')
      .optional()
      .isIn([
        'clothing',
        'electronics',
        'furniture',
        'books',
        'toys',
        'sports',
        'kitchen',
        'garden',
        'automotive',
        'other'
      ])
      .withMessage('Invalid category'),
    query('condition')
      .optional()
      .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
      .withMessage('Invalid condition'),
    query('longitude')
      .optional()
      .isFloat()
      .withMessage('Longitude must be a number'),
    query('latitude')
      .optional()
      .isFloat()
      .withMessage('Latitude must be a number'),
    query('radius')
      .optional()
      .isFloat({ min: 0.1, max: 100 })
      .withMessage('Radius must be between 0.1 and 100 km'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'estimatedValue', 'views'])
      .withMessage('Invalid sort field'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc')
  ],
  validateRequest,
  itemController.getItems
);
/**
 * @route GET /api/items/search
 * @desc Search items by text
 * @access Public
 */
router.get(
  '/search',
  [
    query('query')
      .notEmpty()
      .withMessage('Search query is required'),
    query('category')
      .optional()
      .isIn([
        'clothing',
        'electronics',
        'furniture',
        'books',
        'toys',
        'sports',
        'kitchen',
        'garden',
        'automotive',
        'other'
      ])
      .withMessage('Invalid category'),
    query('condition')
      .optional()
      .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
      .withMessage('Invalid condition'),
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
  itemController.searchItems
);

/**
 * @route GET /api/items/nearby
 * @desc Get nearby items
 * @access Private
 */
router.get(
  '/nearby',
  authenticateJWT,
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
  itemController.getNearbyItems
);

/**
 * @route GET /api/items/:id
 * @desc Get item by ID
 * @access Public
 */
router.get(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid item ID')
  ],
  validateRequest,
  itemController.getItemById
);

/**
 * @route PUT /api/items/:id
 * @desc Update item
 * @access Private
 */
router.put(
  '/:id',
  authenticateJWT,
  isResourceOwner(Item),
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid item ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('category')
      .optional()
      .isIn([
        'clothing',
        'electronics',
        'furniture',
        'books',
        'toys',
        'sports',
        'kitchen',
        'garden',
        'automotive',
        'other'
      ])
      .withMessage('Invalid category'),
    body('condition')
      .optional()
      .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
      .withMessage('Invalid condition'),
    body('images')
      .optional()
      .isArray({ min: 1 })
      .withMessage('At least one image is required'),
    body('images.*')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL'),
    body('estimatedValue')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Estimated value must be a positive number'),
    body('isAvailable')
      .optional()
      .isBoolean()
      .withMessage('isAvailable must be a boolean')
  ],
  validateRequest,
  itemController.updateItem
);

/**
 * @route DELETE /api/items/:id
 * @desc Delete item
 * @access Private
 */
router.delete(
  '/:id',
  authenticateJWT,
  isResourceOwner(Item),
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid item ID')
  ],
  validateRequest,
  itemController.deleteItem
);

/**
 * @route POST /api/items/:id/interest
 * @desc Express interest in an item
 * @access Private
 */
router.post(
  '/:id/interest',
  authenticateJWT,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid item ID')
  ],
  validateRequest,
  itemController.expressInterest
);

module.exports = router;