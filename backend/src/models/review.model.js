const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  swap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster review retrieval
reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ swap: 1 });

// Update the swap with the review
reviewSchema.post('save', async function(doc) {
  try {
    const Swap = mongoose.model('Swap');
    const swap = await Swap.findById(doc.swap);
    
    if (swap) {
      // Determine if this is the initiator's or receiver's review
      if (doc.reviewer.toString() === swap.initiator.toString()) {
        await Swap.findByIdAndUpdate(doc.swap, {
          initiatorReview: doc._id
        });
      } else if (doc.reviewer.toString() === swap.receiver.toString()) {
        await Swap.findByIdAndUpdate(doc.swap, {
          receiverReview: doc._id
        });
      }
    }
    
    // Update the reviewee's average rating
    const User = mongoose.model('User');
    const user = await User.findById(doc.reviewee);
    
    if (user) {
      // Get all reviews for this user
      const Review = mongoose.model('Review');
      const reviews = await Review.find({ reviewee: doc.reviewee });
      
      // Calculate new average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      // Update user's rating
      await User.findByIdAndUpdate(doc.reviewee, {
        'rating.average': averageRating,
        'rating.count': reviews.length
      });
    }
  } catch (error) {
    console.error('Error updating after review save:', error);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;