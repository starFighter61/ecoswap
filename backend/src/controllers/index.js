const authController = require('./auth.controller');
const userController = require('./user.controller');
const itemController = require('./item.controller');
const swapController = require('./swap.controller');
const messageController = require('./message.controller');
const reviewController = require('./review.controller');
const notificationController = require('./notification.controller');
const adminController = require('./admin.controller');

module.exports = {
  authController,
  userController,
  itemController,
  swapController,
  messageController,
  reviewController,
  notificationController,
  adminController
};