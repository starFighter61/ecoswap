const express = require('express');
const { body, param, query } = require('express-validator');
const { reviewController } = require('../controllers');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateJWT);

/**
 * @route POST /api/reviews
 * @desc Create a new review
 * @access Private
 */
router.post(
  '/',
  [
    body('swapId')
      .isMongoId()
      .withMessage('Invalid swap ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Comment must be between 10 and 500 characters')
  ],
  validateRequest,
  reviewController.createReview
);

/**
 * @route GET /api/reviews/user/:userId
 * @desc Get reviews for a user
 * @access Public
 */
router.get(
  '/user/:userId',
  [
    param('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
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
  reviewController.getUserReviews
);

/**
 * @route GET /api/reviews/swap/:swapId
 * @desc Get reviews for a swap
 * @access Private
 */
router.get(
  '/swap/:swapId',
  [
    param('swapId')
      .isMongoId()
      .withMessage('Invalid swap ID')
  ],
  validateRequest,
  reviewController.getSwapReviews
);

/**
 * @route PUT /api/reviews/:id
 * @desc Update a review
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid review ID'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Comment must be between 10 and 500 characters')
  ],
  validateRequest,
  reviewController.updateReview
);

module.exports = router;