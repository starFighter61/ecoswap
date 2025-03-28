const mongoose = require('mongoose');
const { Item, User } = require('../models');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find the first user
      const user = await User.findOne();
      
      if (!user) {
        console.error('No users found. Please create a user first.');
        process.exit(1);
      }
      
      console.log(`Found user: ${user.firstName} ${user.lastName} (${user._id})`);
      
      // Create a test item
      const testItem = new Item({
        owner: user._id,
        title: 'Test Item - Created Directly',
        description: 'This is a test item created directly via script.',
        category: 'clothing',
        condition: 'good',
        images: ['https://via.placeholder.com/300x200?text=Test+Item'],
        estimatedValue: 25,
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749] // San Francisco coordinates
        }
      });
      
      // Save the item
      await testItem.save();
      
      console.log(`Test item created successfully with ID: ${testItem._id}`);
      console.log('Item details:', testItem);
      
      process.exit(0);
    } catch (error) {
      console.error('Error creating test item:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });