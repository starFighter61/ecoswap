const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  initiatorItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  receiverItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  meetupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  meetupTime: {
    type: Date
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  environmentalImpact: {
    co2Saved: {
      type: Number,
      default: 0
    },
    wasteReduced: {
      type: Number,
      default: 0
    }
  },
  initiatorReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  receiverReview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate environmental impact when swap is completed
swapSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    try {
      // Get items to calculate total environmental impact
      const Item = mongoose.model('Item');
      const initiatorItem = await Item.findById(this.initiatorItem);
      const receiverItem = await Item.findById(this.receiverItem);
      
      if (initiatorItem && receiverItem) {
        // Sum the environmental impact of both items
        this.environmentalImpact.co2Saved = 
          initiatorItem.environmentalImpact.co2Saved + 
          receiverItem.environmentalImpact.co2Saved;
        
        this.environmentalImpact.wasteReduced = 
          initiatorItem.environmentalImpact.wasteReduced + 
          receiverItem.environmentalImpact.wasteReduced;
        
        // Update user environmental impact
        const User = mongoose.model('User');
        
        // Update initiator's environmental impact
        await User.findByIdAndUpdate(this.initiator, {
          $inc: {
            'environmentalImpact.co2Saved': this.environmentalImpact.co2Saved / 2,
            'environmentalImpact.wasteReduced': this.environmentalImpact.wasteReduced / 2,
            'environmentalImpact.swapsCompleted': 1
          }
        });
        
        // Update receiver's environmental impact
        await User.findByIdAndUpdate(this.receiver, {
          $inc: {
            'environmentalImpact.co2Saved': this.environmentalImpact.co2Saved / 2,
            'environmentalImpact.wasteReduced': this.environmentalImpact.wasteReduced / 2,
            'environmentalImpact.swapsCompleted': 1
          }
        });
        
        // Update items availability
        await Item.findByIdAndUpdate(this.initiatorItem, { isAvailable: false });
        await Item.findByIdAndUpdate(this.receiverItem, { isAvailable: false });
      }
    } catch (error) {
      console.error('Error calculating environmental impact:', error);
    }
  }
  next();
});

const Swap = mongoose.model('Swap', swapSchema);

module.exports = Swap;