const { User, Item, Swap, Review } = require('../models');
const { createGeoQuery } = require('../utils/geolocation.utils');

/**
 * Get user profile by ID
 * @route GET /api/users/:id
 * @access Private
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/:id
 * @access Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is updating their own profile
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile.'
      });
    }
    
    const { username, firstName, lastName, bio, location } = req.body;
    
    // Check if username is already taken
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken.'
        });
      }
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username || req.user.username,
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        bio: bio !== undefined ? bio : req.user.bio,
        location: location || req.user.location,
        updatedAt: Date.now()
      },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user items
 * @route GET /api/users/:id/items
 * @access Private
 */
const getUserItems = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const items = await Item.find({ owner: userId });
    
    res.status(200).json({
      success: true,
      data: {
        items
      }
    });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user items.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user swaps
 * @route GET /api/users/:id/swaps
 * @access Private
 */
const getUserSwaps = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is requesting their own swaps
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own swaps.'
      });
    }
    
    const swaps = await Swap.find({
      $or: [
        { initiator: userId },
        { receiver: userId }
      ]
    })
    .populate('initiatorItem')
    .populate('receiverItem')
    .populate({
      path: 'initiator',
      select: 'username firstName lastName profilePicture'
    })
    .populate({
      path: 'receiver',
      select: 'username firstName lastName profilePicture'
    });
    
    res.status(200).json({
      success: true,
      data: {
        swaps
      }
    });
  } catch (error) {
    console.error('Get user swaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user swaps.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user reviews
 * @route GET /api/users/:id/reviews
 * @access Private
 */
const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const reviews = await Review.find({ reviewee: userId })
      .populate({
        path: 'reviewer',
        select: 'username firstName lastName profilePicture'
      })
      .populate('swap');
    
    res.status(200).json({
      success: true,
      data: {
        reviews
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get nearby users
 * @route GET /api/users/nearby
 * @access Private
 */
const getNearbyUsers = async (req, res) => {
  try {
    const { longitude, latitude, radius = 10 } = req.query;
    
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required.'
      });
    }
    
    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    const geoQuery = createGeoQuery(coordinates, parseFloat(radius));
    
    const users = await User.find({
      ...geoQuery,
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('username firstName lastName profilePicture location rating')
    .limit(50);
    
    res.status(200).json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Get nearby users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby users.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user environmental impact
 * @route GET /api/users/:id/impact
 * @access Private
 */
const getUserImpact = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId).select('environmentalImpact');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Get additional stats
    const completedSwaps = await Swap.countDocuments({
      $or: [{ initiator: userId }, { receiver: userId }],
      status: 'completed'
    });
    
    res.status(200).json({
      success: true,
      data: {
        impact: user.environmentalImpact,
        completedSwaps
      }
    });
  } catch (error) {
    console.error('Get user impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user environmental impact.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search users
 * @route GET /api/users/search
 * @access Private
 */
const searchUsers = async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required.'
      });
    }
    
    // Build search query
    const searchQuery = {
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } }
      ]
    };
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const users = await User.find(searchQuery)
      .select('username firstName lastName profilePicture location rating')
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: totalUsers,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalUsers / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserItems,
  getUserSwaps,
  getUserReviews,
  getNearbyUsers,
  getUserImpact,
  searchUsers
};