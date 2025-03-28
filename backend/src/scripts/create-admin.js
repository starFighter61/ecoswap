/**
 * Script to create an admin user
 * 
 * Usage: node src/scripts/create-admin.js
 * 
 * Environment variables:
 * - ADMIN_USERNAME: Admin username (default: admin)
 * - ADMIN_EMAIL: Admin email (required)
 * - ADMIN_PASSWORD: Admin password (required)
 * - ADMIN_FIRST_NAME: Admin first name (default: Admin)
 * - ADMIN_LAST_NAME: Admin last name (default: User)
 * - MONGODB_URI: MongoDB connection URI (default: mongodb://localhost:27017/ecoswap)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models');

// Check required environment variables
if (!process.env.ADMIN_EMAIL) {
  console.error('ADMIN_EMAIL environment variable is required');
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD environment variable is required');
  process.exit(1);
}

// Set default values
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
const adminLastName = process.env.ADMIN_LAST_NAME || 'User';
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoswap';

// Connect to MongoDB
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: adminEmail }, { username: adminUsername }] 
    });
    
    if (existingUser) {
      console.log('Admin user already exists');
      
      // Update role to admin if not already
      if (existingUser.role !== 'admin') {
        await User.findByIdAndUpdate(existingUser._id, { role: 'admin' });
        console.log('Updated user role to admin');
      }
      
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = new User({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      role: 'admin',
      location: {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates
      }
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});