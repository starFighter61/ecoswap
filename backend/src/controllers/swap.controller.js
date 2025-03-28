const { Swap, Item, User } = require('../models');
const { calculateSwapImpact, generateImpactStatement } = require('../utils/environmental.utils');
const { notificationController } = require('./index');

/**
 * Create a new swap request
 * @route POST /api/swaps
 * @access Private
 */
const createSwap = async (req, res) => {
  try {
    const { initiatorItem, receiverItem, message } = req.body;
    
    // Check if items exist
    const [initiatorItemDoc, receiverItemDoc] = await Promise.all([
      Item.findById(initiatorItem),
      Item.findById(receiverItem)
    ]);
    
    if (!initiatorItemDoc || !receiverItemDoc) {
      return res.status(404).json({
        success: false,
        message: 'One or both items not found.'
      });
    }
    
    // Check if items are available
    if (!initiatorItemDoc.isAvailable || !receiverItemDoc.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'One or both items are not available for swapping.'
      });
    }
    
    // Check if initiator is the owner of the initiator item
    if (initiatorItemDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only offer items that you own.'
      });
    }
    
    // Check if initiator is not the owner of the receiver item
    if (receiverItemDoc.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot swap with yourself.'
      });
    }
    
    // Create new swap
    const swap = new Swap({
      initiator: req.user._id,
      receiver: receiverItemDoc.owner,
      initiatorItem,
      receiverItem
    });
    await swap.save();
    
    // Create initial message if provided
    if (message) {
      const Message = require('../models/message.model');
      const newMessage = new Message({
        swap: swap._id,
        sender: req.user._id,
        receiver: receiverItemDoc.owner,
        content: message
      });
      
      await newMessage.save();
    }
    
    // Mark items as pending (but still available for other swaps)
    await Promise.all([
      Item.findByIdAndUpdate(initiatorItem, { $push: { pendingSwaps: swap._id } }),
      Item.findByIdAndUpdate(receiverItem, { $push: { pendingSwaps: swap._id } })
    ]);
    
    // Create notification for the receiver
    await notificationController.createNotification({
      recipient: receiverItemDoc.owner,
      sender: req.user._id,
      type: 'swap_request',
      title: 'New Swap Request',
      message: `${req.user.username} wants to swap their ${initiatorItemDoc.title} for your ${receiverItemDoc.title}`,
      relatedItem: receiverItem,
      relatedSwap: swap._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Swap request created successfully.',
      data: {
        swap
      }
    });
  } catch (error) {
    console.error('Create swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating swap request.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all swaps for current user
 * @route GET /api/swaps
 * @access Private
 */
const getSwaps = async (req, res) => {
  try {
    const { status, role, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query = {
      $or: [
        { initiator: req.user._id },
        { receiver: req.user._id }
      ]
    };
    
    // Add status filter
    if (status) {
      query.status = status;
    }
    
    // Add role filter (initiator or receiver)
    if (role === 'initiator') {
      query.$or = [{ initiator: req.user._id }];
    } else if (role === 'receiver') {
      query.$or = [{ receiver: req.user._id }];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const swaps = await Swap.find(query)
      .populate('initiatorItem')
      .populate('receiverItem')
      .populate({
        path: 'initiator',
        select: 'username firstName lastName profilePicture'
      })
      .populate({
        path: 'receiver',
        select: 'username firstName lastName profilePicture'
      })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalSwaps = await Swap.countDocuments(query);
    
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
    console.error('Get swaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching swaps.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get swap by ID
 * @route GET /api/swaps/:id
 * @access Private
 */
const getSwapById = async (req, res) => {
  try {
    const swapId = req.params.id;
    
    const swap = await Swap.findById(swapId)
      .populate('initiatorItem')
      .populate('receiverItem')
      .populate({
        path: 'initiator',
        select: 'username firstName lastName profilePicture location'
      })
      .populate({
        path: 'receiver',
        select: 'username firstName lastName profilePicture location'
      })
      .populate({
        path: 'messages',
        options: { sort: { createdAt: 1 } }
      })
      .populate('initiatorReview')
      .populate('receiverReview');
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found.'
      });
    }
    
    // Check if user is part of the swap
    if (
      swap.initiator._id.toString() !== req.user._id.toString() &&
      swap.receiver._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this swap.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        swap
      }
    });
  } catch (error) {
    console.error('Get swap by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching swap.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update swap status
 * @route PUT /api/swaps/:id/status
 * @access Private
 */
const updateSwapStatus = async (req, res) => {
  try {
    const swapId = req.params.id;
    const { status, meetupLocation, meetupTime } = req.body;
    
    const swap = await Swap.findById(swapId)
      .populate('initiatorItem')
      .populate('receiverItem');
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found.'
      });
    }
    
    // Check if user is part of the swap
    if (
      swap.initiator.toString() !== req.user._id.toString() &&
      swap.receiver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this swap.'
      });
    }
    
    // Validate status transition
    const validTransitions = {
      pending: ['accepted', 'rejected', 'cancelled'],
      accepted: ['completed', 'cancelled'],
      rejected: [],
      completed: [],
      cancelled: []
    };
    
    if (!validTransitions[swap.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${swap.status} to ${status}.`
      });
    }
    
    // Additional validation for specific transitions
    if (status === 'accepted' && swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can accept a swap.'
      });
    }
    
    if (status === 'rejected' && swap.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can reject a swap.'
      });
    }
    
    if (status === 'completed') {
      // Both users must confirm completion
      if (!meetupLocation || !meetupTime) {
        return res.status(400).json({
          success: false,
          message: 'Meetup location and time are required to complete a swap.'
        });
      }
    }
    
    // Update swap
    const updateData = { status };
    
    if (meetupLocation) {
      updateData.meetupLocation = meetupLocation;
    }
    
    if (meetupTime) {
      updateData.meetupTime = meetupTime;
    }
    
    const updatedSwap = await Swap.findByIdAndUpdate(
      swapId,
      updateData,
      { new: true }
    );
    
    // Handle status-specific actions
    if (status === 'completed') {
      // Calculate environmental impact
      const impact = calculateSwapImpact(swap.initiatorItem, swap.receiverItem);
      updatedSwap.environmentalImpact = impact;
      await updatedSwap.save();
      
      // Update items availability
      await Promise.all([
        Item.findByIdAndUpdate(swap.initiatorItem._id, { isAvailable: false }),
        Item.findByIdAndUpdate(swap.receiverItem._id, { isAvailable: false })
      ]);
      
      // Update user environmental impact
      await Promise.all([
        User.findByIdAndUpdate(swap.initiator, {
          $inc: {
            'environmentalImpact.co2Saved': impact.co2Saved / 2,
            'environmentalImpact.wasteReduced': impact.wasteReduced / 2,
            'environmentalImpact.swapsCompleted': 1
          }
        }),
        User.findByIdAndUpdate(swap.receiver, {
          $inc: {
            'environmentalImpact.co2Saved': impact.co2Saved / 2,
            'environmentalImpact.wasteReduced': impact.wasteReduced / 2,
            'environmentalImpact.swapsCompleted': 1
          }
        })
      ]);
      
      // Create notifications for both users
      const initiatorUser = await User.findById(swap.initiator);
      const receiverUser = await User.findById(swap.receiver);
      
      // Notification for initiator
      await notificationController.createNotification({
        recipient: swap.initiator,
        sender: swap.receiver,
        type: 'swap_completed',
        title: 'Swap Completed',
        message: `Your swap with ${receiverUser.username} has been completed. The items have been exchanged.`,
        relatedSwap: swap._id
      });
      
      // Notification for receiver
      await notificationController.createNotification({
        recipient: swap.receiver,
        sender: swap.initiator,
        type: 'swap_completed',
        title: 'Swap Completed',
        message: `Your swap with ${initiatorUser.username} has been completed. The items have been exchanged.`,
        relatedSwap: swap._id
      });
      
    } else if (status === 'accepted') {
      // Create notification for the initiator
      const receiverUser = await User.findById(swap.receiver);
      
      await notificationController.createNotification({
        recipient: swap.initiator,
        sender: swap.receiver,
        type: 'swap_accepted',
        title: 'Swap Request Accepted',
        message: `${receiverUser.username} has accepted your swap request. You can now arrange a meetup.`,
        relatedSwap: swap._id
      });
      
    } else if (status === 'rejected') {
      // Create notification for the initiator
      const receiverUser = await User.findById(swap.receiver);
      
      await notificationController.createNotification({
        recipient: swap.initiator,
        sender: swap.receiver,
        type: 'swap_rejected',
        title: 'Swap Request Rejected',
        message: `${receiverUser.username} has rejected your swap request.`,
        relatedSwap: swap._id
      });
      
      // Remove pending swap references
      await Promise.all([
        Item.findByIdAndUpdate(swap.initiatorItem._id, { $pull: { pendingSwaps: swap._id } }),
        Item.findByIdAndUpdate(swap.receiverItem._id, { $pull: { pendingSwaps: swap._id } })
      ]);
      
    } else if (status === 'cancelled') {
      // Determine who cancelled the swap
      const canceller = req.user._id.toString() === swap.initiator.toString() ? 'initiator' : 'receiver';
      const otherParty = canceller === 'initiator' ? swap.receiver : swap.initiator;
      const cancellerUser = await User.findById(req.user._id);
      
      // Create notification for the other party
      await notificationController.createNotification({
        recipient: otherParty,
        sender: req.user._id,
        type: 'swap_cancelled',
        title: 'Swap Cancelled',
        message: `${cancellerUser.username} has cancelled the swap.`,
        relatedSwap: swap._id
      });
      
      // Remove pending swap references
      await Promise.all([
        Item.findByIdAndUpdate(swap.initiatorItem._id, { $pull: { pendingSwaps: swap._id } }),
        Item.findByIdAndUpdate(swap.receiverItem._id, { $pull: { pendingSwaps: swap._id } })
      ]);
    }
    
    res.status(200).json({
      success: true,
      message: `Swap ${status} successfully.`,
      data: {
        swap: updatedSwap
      }
    });
  } catch (error) {
    console.error('Update swap status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating swap status.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get swap environmental impact
 * @route GET /api/swaps/:id/impact
 * @access Private
 */
const getSwapImpact = async (req, res) => {
  try {
    const swapId = req.params.id;
    
    const swap = await Swap.findById(swapId)
      .populate('initiatorItem')
      .populate('receiverItem');
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found.'
      });
    }
    
    // Check if user is part of the swap
    if (
      swap.initiator.toString() !== req.user._id.toString() &&
      swap.receiver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this swap.'
      });
    }
    
    // Calculate impact (even if not completed yet)
    const impact = calculateSwapImpact(swap.initiatorItem, swap.receiverItem);
    const impactStatement = generateImpactStatement(impact);
    
    res.status(200).json({
      success: true,
      data: {
        impact,
        statement: impactStatement
      }
    });
  } catch (error) {
    console.error('Get swap impact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching swap environmental impact.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createSwap,
  getSwaps,
  getSwapById,
  updateSwapStatus,
  getSwapImpact
};