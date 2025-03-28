const crypto = require('crypto');

/**
 * Generate a random token for password reset
 * @returns {String} Random token
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a reset token for secure storage
 * @param {String} token - Reset token
 * @returns {String} Hashed token
 */
const hashResetToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

module.exports = {
  generateResetToken,
  hashResetToken
};