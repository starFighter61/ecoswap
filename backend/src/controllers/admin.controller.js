const { User, Item, Swap, Message, Review, Notification } = require('../models');

/**
 * Get system statistics
 * @route GET /api/admin/stats
 * @access Admin
 */
const getSystemStats = async (req, res) => {
  try {
    // Get counts
    const [
      userCount,
      itemCount,
      swapCount,
      completedSwapCount,
      messageCount,
      reviewCount
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Swap.countDocuments(),
      Swap.countDocuments({ status: 'completed' }),
      Message.countDocuments(),
      Review.countDocuments()
    ]);
    
    // Get environmental impact
    const totalImpact = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCO2Saved: { $sum: '$environmentalImpact.co2Saved' },
          totalWasteReduced: { $sum: '$environmentalImpact.wasteReduced' },
          totalSwapsCompleted: { $sum: '$environmentalImpact.swapsCompleted' }
        }
      }
    ]);
    
    // Get recent activity
    const recentSwaps = await Swap.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate({
        path: 'initiator',
        select: 'username'
      })
      .populate({
        path: 'receiver',
        select: 'username'
      })
      .populate({
        path: 'initiatorItem',
        select: 'title'
      })
      .populate({
        path: 'receiverItem',
        select: 'title'
      });
    
    // Get user growth (users per month)
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Get swap growth (swaps per month)
    const swapGrowth = await Swap.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          items: itemCount,
          swaps: swapCount,
          completedSwaps: completedSwapCount,
          messages: messageCount,
          reviews: reviewCount
        },
        environmentalImpact: totalImpact.length > 0 ? {
          co2Saved: totalImpact[0].totalCO2Saved,
          wasteReduced: totalImpact[0].totalWasteReduced,
          swapsCompleted: totalImpact[0].totalSwapsCompleted
        } : {
          co2Saved: 0,
          wasteReduced: 0,
          swapsCompleted: 0
        },
        recentActivity: recentSwaps,
        growth: {
          users: userGrowth,
          swaps: swapGrowth
        }
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system statistics.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all users (admin)
 * @route GET /api/admin/users
 * @access Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const { limit = 20, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const users = await User.find()
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments();
    
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
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all items (admin)
 * @route GET /api/admin/items
 * @access Admin
 */
const getAllItems = async (req, res) => {
  try {
    const { limit = 20, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const items = await Item.find()
      .populate({
        path: 'owner',
        select: 'username firstName lastName'
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalItems = await Item.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          total: totalItems,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalItems / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all swaps (admin)
 * @route GET /api/admin/swaps
 * @access Admin
 */
const getAllSwaps = async (req, res) => {
  try {
    const { limit = 20, page = 1, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const swaps = await Swap.find()
      .populate({
        path: 'initiator',
        select: 'username firstName lastName'
      })
      .populate({
        path: 'receiver',
        select: 'username firstName lastName'
      })
      .populate('initiatorItem')
      .populate('receiverItem')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalSwaps = await Swap.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        swaps,
        pagination: {
          total: totalSwaps,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalSwaps / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all swaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching swaps.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Send system notification to all users
 * @route POST /api/admin/notifications/system
 * @access Admin
 */
const sendSystemNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    
    // Get all users
    const users = await User.find().select('_id');
    
    // Create notifications for all users
    const notifications = users.map(user => ({
      recipient: user._id,
      type: 'system',
      title,
      message
    }));
    
    await Notification.insertMany(notifications);
    
    res.status(200).json({
      success: true,
      message: `System notification sent to ${users.length} users.`
    });
  } catch (error) {
    console.error('Send system notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending system notification.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getSystemStats,
  getAllUsers,
  getAllItems,
  getAllSwaps,
  sendSystemNotification
};