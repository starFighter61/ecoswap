const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'clothing',
      'electronics',
      'furniture',
      'books',
      'toys',
      'sports',
      'kitchen',
      'garden',
      'automotive',
      'other'
    ]
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair', 'poor']
  },
  images: [{
    type: String,
    required: true
  }],
  estimatedValue: {
    type: Number,
    min: 0
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
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
  isAvailable: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  interestedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

// Create index for geospatial queries
itemSchema.index({ location: '2dsphere' });
// Create index for category and condition for faster filtering
itemSchema.index({ category: 1, condition: 1 });
// Create index for availability status
itemSchema.index({ isAvailable: 1 });
// Create text index for search
itemSchema.index({ title: 'text', description: 'text' });

// Calculate environmental impact based on item category and condition
itemSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('category') || this.isModified('condition')) {
    // Simple formula for CO2 saved (in kg) based on category
    const co2Factors = {
      'clothing': 10,
      'electronics': 50,
      'furniture': 100,
      'books': 5,
      'toys': 8,
      'sports': 15,
      'kitchen': 20,
      'garden': 25,
      'automotive': 200,
      'other': 10
    };
    
    // Condition factor (multiplier based on condition)
    const conditionFactors = {
      'new': 1.0,
      'like-new': 0.9,
      'good': 0.7,
      'fair': 0.5,
      'poor': 0.3
    };
    
    // Calculate CO2 saved
    this.environmentalImpact.co2Saved = 
      co2Factors[this.category] * conditionFactors[this.condition];
    
    // Calculate waste reduced (in kg) - simplified formula
    this.environmentalImpact.wasteReduced = 
      this.environmentalImpact.co2Saved * 0.2; // Assuming waste is 20% of CO2 impact
  }
  next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;