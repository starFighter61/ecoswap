const { Message, Swap } = require('../models');
const { notificationController } = require('./index');

/**
 * Send a new message
 * @route POST /api/messages
 * @access Private
 */
const sendMessage = async (req, res) => {
  try {
    const { swapId, content } = req.body;
    
    // Check if swap exists
    const swap = await Swap.findById(swapId);
    
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
        message: 'You are not authorized to send messages in this swap.'
      });
    }
    
    // Determine receiver
    const receiver = 
      swap.initiator.toString() === req.user._id.toString()
        ? swap.receiver
        : swap.initiator;
    
    // Create new message
    const message = new Message({
      swap: swapId,
      sender: req.user._id,
      receiver,
      content
    });
    
    await message.save();
    
    // Update swap's updatedAt timestamp
    await Swap.findByIdAndUpdate(swapId, { updatedAt: Date.now() });
    
    // Create notification for the receiver
    const swapDetails = await Swap.findById(swapId)
      .populate({
        path: 'initiatorItem',
        select: 'title'
      })
      .populate({
        path: 'receiverItem',
        select: 'title'
      });
    
    await notificationController.createNotification({
      recipient: receiver,
      sender: req.user._id,
      type: 'message',
      title: 'New Message',
      message: `${req.user.username} sent you a message regarding the swap of ${swapDetails.initiatorItem.title} for ${swapDetails.receiverItem.title}`,
      relatedSwap: swapId
    });
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: {
        message
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get messages for a swap
 * @route GET /api/messages/:swapId
 * @access Private
 */
const getMessages = async (req, res) => {
  try {
    const swapId = req.params.swapId;
    
    // Check if swap exists
    const swap = await Swap.findById(swapId);
    
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
        message: 'You are not authorized to view messages in this swap.'
      });
    }
    
    // Get messages
    const messages = await Message.find({ swap: swapId })
      .populate({
        path: 'sender',
        select: 'username firstName lastName profilePicture'
      })
      .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      {
        swap: swapId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get unread message count
 * @route GET /api/messages/unread
 * @access Private
 */
const getUnreadCount = async (req, res) => {
  try {
    // Count unread messages
    const unreadCount = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });
    
    // Get swaps with unread messages
    const swapsWithUnread = await Message.aggregate([
      {
        $match: {
          receiver: req.user._id,
          isRead: false
        }
      },
      {
        $group: {
          _id: '$swap',
          count: { $sum: 1 },
          lastMessage: { $last: '$content' },
          lastMessageTime: { $last: '$createdAt' }
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Populate swap details
    const populatedSwaps = await Swap.populate(swapsWithUnread, {
      path: '_id',
      select: 'initiator receiver initiatorItem receiverItem status',
      populate: [
        {
          path: 'initiator',
          select: 'username firstName lastName profilePicture'
        },
        {
          path: 'receiver',
          select: 'username firstName lastName profilePicture'
        },
        {
          path: 'initiatorItem',
          select: 'title images'
        },
        {
          path: 'receiverItem',
          select: 'title images'
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        unreadCount,
        swapsWithUnread: populatedSwaps.map(item => ({
          swap: item._id,
          unreadCount: item.count,
          lastMessage: item.lastMessage,
          lastMessageTime: item.lastMessageTime
        }))
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread message count.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Mark messages as read
 * @route PUT /api/messages/:swapId/read
 * @access Private
 */
const markAsRead = async (req, res) => {
  try {
    const swapId = req.params.swapId;
    
    // Check if swap exists
    const swap = await Swap.findById(swapId);
    
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
        message: 'You are not authorized to mark messages in this swap.'
      });
    }
    
    // Mark messages as read
    await Message.updateMany(
      {
        swap: swapId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Messages marked as read.'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getUnreadCount,
  markAsRead
};