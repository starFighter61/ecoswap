const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

/**
 * Middleware to check if user is the owner of a resource
 */
const isResourceOwner = (resourceModel) => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await resourceModel.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }
    
    // Check if the resource has an owner field and if it matches the current user
    if (resource.owner && resource.owner.toString() === req.user._id.toString()) {
      next();
    } else if (resource.initiator && resource.initiator.toString() === req.user._id.toString()) {
      // For swap resources that have initiator instead of owner
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resource.'
      });
    }
  } catch (error) {
    console.error('Resource ownership check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during resource ownership check.'
    });
  }
};

module.exports = {
  authenticateJWT,
  isAdmin,
  isResourceOwner
};