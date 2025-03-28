const express = require('express');
const { body, param, query } = require('express-validator');
const { swapController } = require('../controllers');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateJWT);

/**
 * @route POST /api/swaps
 * @desc Create a new swap request
 * @access Private
 */
router.post(
  '/',
  [
    body('initiatorItem')
      .isMongoId()
      .withMessage('Invalid initiator item ID'),
    body('receiverItem')
      .isMongoId()
      .withMessage('Invalid receiver item ID'),
    body('message')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Message must be between 1 and 500 characters')
  ],
  validateRequest,
  swapController.createSwap
);

/**
 * @route GET /api/swaps
 * @desc Get all swaps for current user
 * @access Private
 */
router.get(
  '/',
  [
    query('status')
      .optional()
      .isIn(['pending', 'accepted', 'rejected', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
    query('role')
      .optional()
      .isIn(['initiator', 'receiver'])
      .withMessage('Role must be initiator or receiver'),
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
  swapController.getSwaps
);

/**
 * @route GET /api/swaps/:id
 * @desc Get swap by ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid swap ID')
  ],
  validateRequest,
  swapController.getSwapById
);

/**
 * @route PUT /api/swaps/:id/status
 * @desc Update swap status
 * @access Private
 */
router.put(
  '/:id/status',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid swap ID'),
    body('status')
      .isIn(['accepted', 'rejected', 'completed', 'cancelled'])
      .withMessage('Invalid status'),
    body('meetupLocation')
      .optional()
      .isObject()
      .withMessage('Meetup location must be an object'),
    body('meetupLocation.coordinates')
      .optional()
      .isArray({ min: 2, max: 2 })
      .withMessage('Coordinates must be an array of [longitude, latitude]'),
    body('meetupLocation.coordinates.*')
      .optional()
      .isFloat()
      .withMessage('Coordinates must be numbers'),
    body('meetupLocation.address')
      .optional()
      .isObject()
      .withMessage('Address must be an object'),
    body('meetupTime')
      .optional()
      .isISO8601()
      .withMessage('Meetup time must be a valid date')
  ],
  validateRequest,
  swapController.updateSwapStatus
);

/**
 * @route GET /api/swaps/:id/impact
 * @desc Get swap environmental impact
 * @access Private
 */
router.get(
  '/:id/impact',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid swap ID')
  ],
  validateRequest,
  swapController.getSwapImpact
);

module.exports = router;