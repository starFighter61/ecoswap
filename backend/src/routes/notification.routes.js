const express = require('express');
const { param, query } = require('express-validator');
const { notificationController } = require('../controllers');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateJWT);

/**
 * @route GET /api/notifications
 * @desc Get user notifications
 * @access Private
 */
router.get(
  '/',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('unreadOnly')
      .optional()
      .isBoolean()
      .withMessage('unreadOnly must be a boolean')
  ],
  validateRequest,
  notificationController.getUserNotifications
);

/**
 * @route PUT /api/notifications/:id/read
 * @desc Mark notification as read
 * @access Private
 */
router.put(
  '/:id/read',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid notification ID')
  ],
  validateRequest,
  notificationController.markAsRead
);

/**
 * @route PUT /api/notifications/read-all
 * @desc Mark all notifications as read
 * @access Private
 */
router.put('/read-all', notificationController.markAllAsRead);

/**
 * @route DELETE /api/notifications/:id
 * @desc Delete a notification
 * @access Private
 */
router.delete(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid notification ID')
  ],
  validateRequest,
  notificationController.deleteNotification
);

module.exports = router;