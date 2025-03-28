const express = require('express');
const { body, param } = require('express-validator');
const { messageController } = require('../controllers');
const { validateRequest } = require('../middleware/validation.middleware');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateJWT);

/**
 * @route POST /api/messages
 * @desc Send a new message
 * @access Private
 */
router.post(
  '/',
  [
    body('swapId')
      .isMongoId()
      .withMessage('Invalid swap ID'),
    body('content')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Message content must be between 1 and 500 characters')
  ],
  validateRequest,
  messageController.sendMessage
);

/**
 * @route GET /api/messages/:swapId
 * @desc Get messages for a swap
 * @access Private
 */
router.get(
  '/:swapId',
  [
    param('swapId')
      .isMongoId()
      .withMessage('Invalid swap ID')
  ],
  validateRequest,
  messageController.getMessages
);

/**
 * @route GET /api/messages/unread
 * @desc Get unread message count
 * @access Private
 */
router.get('/unread', messageController.getUnreadCount);

/**
 * @route PUT /api/messages/:swapId/read
 * @desc Mark messages as read
 * @access Private
 */
router.put(
  '/:swapId/read',
  [
    param('swapId')
      .isMongoId()
      .withMessage('Invalid swap ID')
  ],
  validateRequest,
  messageController.markAsRead
);

module.exports = router;