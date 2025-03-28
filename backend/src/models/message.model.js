const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  swap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for faster message retrieval
messageSchema.index({ swap: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

// Virtual for formatting time
messageSchema.virtual('formattedTime').get(function() {
  return new Date(this.createdAt).toLocaleString();
});

// Update the swap with the new message
messageSchema.post('save', async function(doc) {
  try {
    const Swap = mongoose.model('Swap');
    await Swap.findByIdAndUpdate(doc.swap, {
      $push: { messages: doc._id },
      updatedAt: Date.now()
    });
  } catch (error) {
    console.error('Error updating swap with new message:', error);
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;