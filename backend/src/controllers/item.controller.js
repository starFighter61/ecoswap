const { Item, User } = require('../models');
const { createGeoQuery } = require('../utils/geolocation.utils');
const { calculateCO2Savings, calculateWasteReduction } = require('../utils/environmental.utils');

/**
 * Create a new item
 * @route POST /api/items
 * @access Private
 */
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      images,
      estimatedValue,
      location
    } = req.body;
    
    // Create new item
    const item = new Item({
      owner: req.user._id,
      title,
      description,
      category,
      condition,
      images,
      estimatedValue,
      location: location || req.user.location // Use user's location if not provided
    });
    
    // Calculate environmental impact
    item.environmentalImpact = {
      co2Saved: calculateCO2Savings(category, condition),
      wasteReduced: calculateWasteReduction(calculateCO2Savings(category, condition))
    };
    
    await item.save();
    
    res.status(201).json({
      success: true,
      message: 'Item created successfully.',
      data: {
        item
      }
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating item.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all items with filtering
 * @route GET /api/items
 * @access Public
 */
const getItems = async (req, res) => {
  try {
    const {
      category,
      condition,
      longitude,
      latitude,
      radius = 50, // Default radius in km
      limit = 20,
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    let query = {};
    
    // Add availability filter unless includeUnavailable is true
    const includeUnavailable = req.query.includeUnavailable === 'true';
    if (!includeUnavailable) {
      query.isAvailable = true;
    }
    
    // Add owner filter if provided
    if (req.query.owner) {
      query.owner = req.query.owner;
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Add condition filter
    if (condition) {
      query.condition = condition;
    }
    
    // Add geolocation filter if coordinates provided
    if (longitude && latitude) {
      const coordinates = [parseFloat(longitude), parseFloat(latitude)];
      const geoQuery = createGeoQuery(coordinates, parseFloat(radius));
      Object.assign(query, geoQuery);
    }
    
    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const items = await Item.find(query)
      .populate({
        path: 'owner',
        select: 'username firstName lastName profilePicture rating'
      })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalItems = await Item.countDocuments(query);
    
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
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching items.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get item by ID
 * @route GET /api/items/:id
 * @access Public
 */
const getItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    const item = await Item.findById(itemId)
      .populate({
        path: 'owner',
        select: 'username firstName lastName profilePicture rating location'
      });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }
    
    // Increment view count
    await Item.findByIdAndUpdate(itemId, { $inc: { views: 1 } });
    
    res.status(200).json({
      success: true,
      data: {
        item
      }
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching item.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update item
 * @route PUT /api/items/:id
 * @access Private
 */
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }
    
    // Check if user is the owner
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own items.'
      });
    }
    
    const {
      title,
      description,
      category,
      condition,
      images,
      estimatedValue,
      location,
      isAvailable
    } = req.body;
    
    // Update item
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        title: title || item.title,
        description: description || item.description,
        category: category || item.category,
        condition: condition || item.condition,
        images: images || item.images,
        estimatedValue: estimatedValue !== undefined ? estimatedValue : item.estimatedValue,
        location: location || item.location,
        isAvailable: isAvailable !== undefined ? isAvailable : item.isAvailable,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    // Recalculate environmental impact if category or condition changed
    if (category !== item.category || condition !== item.condition) {
      updatedItem.environmentalImpact = {
        co2Saved: calculateCO2Savings(
          category || item.category,
          condition || item.condition
        ),
        wasteReduced: calculateWasteReduction(
          calculateCO2Savings(
            category || item.category,
            condition || item.condition
          )
        )
      };
      
      await updatedItem.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Item updated successfully.',
      data: {
        item: updatedItem
      }
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating item.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete item
 * @route DELETE /api/items/:id
 * @access Private
 */
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }
    
    // Check if user is the owner
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own items.'
      });
    }
    
    await Item.findByIdAndDelete(itemId);
    
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully.'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting item.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Express interest in an item
 * @route POST /api/items/:id/interest
 * @access Private
 */
const expressInterest = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Check if item exists
    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.'
      });
    }
    
    // Check if item is available
    if (!item.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This item is no longer available.'
      });
    }
    
    // Check if user is not the owner
    if (item.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot express interest in your own item.'
      });
    }
    
    // Check if user has already expressed interest
    if (item.interestedUsers.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already expressed interest in this item.'
      });
    }
    
    // Add user to interested users
    await Item.findByIdAndUpdate(
      itemId,
      {
        $push: { interestedUsers: req.user._id }
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Interest expressed successfully.'
    });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({
      success: false,
      message: 'Error expressing interest.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get nearby items
 * @route GET /api/items/nearby
 * @access Private
 */
const getNearbyItems = async (req, res) => {
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
    
    const items = await Item.find({
      ...geoQuery,
      isAvailable: true,
      owner: { $ne: req.user._id } // Exclude current user's items
    })
    .populate({
      path: 'owner',
      select: 'username firstName lastName profilePicture rating'
    })
    .limit(50);
    
    res.status(200).json({
      success: true,
      data: {
        items
      }
    });
  } catch (error) {
    console.error('Get nearby items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby items.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search items by text
 * @route GET /api/items/search
 * @access Public
 */
const searchItems = async (req, res) => {
  try {
    const { query, category, condition, limit = 20, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required.'
      });
    }
    
    // Build search query
    const searchQuery = {
      $text: { $search: query },
      isAvailable: true
    };
    
    // Add category filter
    if (category) {
      searchQuery.category = category;
    }
    
    // Add condition filter
    if (condition) {
      searchQuery.condition = condition;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const items = await Item.find(searchQuery)
      .populate({
        path: 'owner',
        select: 'username firstName lastName profilePicture rating'
      })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalItems = await Item.countDocuments(searchQuery);
    
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
    console.error('Search items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching items.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  expressInterest,
  getNearbyItems,
  searchItems
};