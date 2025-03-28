const { Review, Swap, User } = require('../models');
const { notificationController } = require('./index');

/**
 * Create a new review
 * @route POST /api/reviews
 * @access Private
 */
const createReview = async (req, res) => {
  try {
    const { swapId, rating, comment } = req.body;
    
    // Check if swap exists
    const swap = await Swap.findById(swapId)
      .populate('initiator')
      .populate('receiver')
      .populate('initiatorReview')
      .populate('receiverReview');
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found.'
      });
    }
    
    // Check if swap is completed
    if (swap.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed swaps.'
      });
    }
    
    // Check if user is part of the swap
    if (
      swap.initiator._id.toString() !== req.user._id.toString() &&
      swap.receiver._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to review this swap.'
      });
    }
    
    // Determine if user is initiator or receiver
    const isInitiator = swap.initiator._id.toString() === req.user._id.toString();
    
    // Check if user has already reviewed this swap
    if (
      (isInitiator && swap.initiatorReview) ||
      (!isInitiator && swap.receiverReview)
    ) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this swap.'
      });
    }
    
    // Determine reviewee
    const reviewee = isInitiator ? swap.receiver._id : swap.initiator._id;
    
    // Create new review
    const review = new Review({
      swap: swapId,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment
    });
    await review.save();
    
    // Update swap with review reference
    if (isInitiator) {
      await Swap.findByIdAndUpdate(swapId, { initiatorReview: review._id });
    } else {
      await Swap.findByIdAndUpdate(swapId, { receiverReview: review._id });
    }
    
    // Update reviewee's average rating
    const reviews = await Review.find({ reviewee });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await User.findByIdAndUpdate(reviewee, {
      'rating.average': averageRating,
      'rating.count': reviews.length
    });
    
    // Create notification for the reviewee
    const revieweeUser = await User.findById(reviewee);
    const reviewerUser = await User.findById(req.user._id);
    
    await notificationController.createNotification({
      recipient: reviewee,
      sender: req.user._id,
      type: 'review',
      title: 'New Review',
      message: `${reviewerUser.username} has left you a ${rating}-star review for your swap.`,
      relatedSwap: swapId
    });
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get reviews for a user
 * @route GET /api/reviews/user/:userId
 * @access Public
 */
const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { limit = 10, page = 1 } = req.query;
    
    // Check if user exists
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get reviews
    const reviews = await Review.find({ reviewee: userId })
      .populate({
        path: 'reviewer',
        select: 'username firstName lastName profilePicture'
      })
      .populate({
        path: 'swap',
        select: 'initiatorItem receiverItem status createdAt',
        populate: [
          {
            path: 'initiatorItem',
            select: 'title images category condition'
          },
          {
            path: 'receiverItem',
            select: 'title images category condition'
          }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalReviews = await Review.countDocuments({ reviewee: userId });
    
    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: totalReviews,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalReviews / parseInt(limit))
        }
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
 * Get reviews for a swap
 * @route GET /api/reviews/swap/:swapId
 * @access Private
 */
const getSwapReviews = async (req, res) => {
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
        message: 'You are not authorized to view reviews for this swap.'
      });
    }
    
    // Get reviews
    const reviews = await Review.find({ swap: swapId })
      .populate({
        path: 'reviewer',
        select: 'username firstName lastName profilePicture'
      })
      .populate({
        path: 'reviewee',
        select: 'username firstName lastName profilePicture'
      });
    
    res.status(200).json({
      success: true,
      data: {
        reviews
      }
    });
  } catch (error) {
    console.error('Get swap reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching swap reviews.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a review
 * @route PUT /api/reviews/:id
 * @access Private
 */
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;
    
    // Check if review exists
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.'
      });
    }
    
    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews.'
      });
    }
    
    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    
    await review.save();
    
    // Update reviewee's average rating
    const reviews = await Review.find({ reviewee: review.reviewee });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await User.findByIdAndUpdate(review.reviewee, {
      'rating.average': averageRating
    });
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully.',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createReview,
  getUserReviews,
  getSwapReviews,
  updateReview
};