# EcoSwap

EcoSwap is a platform where users can swap unused or lightly-used items instead of buying new ones, promoting sustainability and reducing waste.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

EcoSwap connects users who want to swap items they no longer need for things they want, reducing waste and building community. The platform includes features like location-based swapping, integrated chat, user reviews, and environmental impact tracking.

## Features

### Location-Based Swapping
- Search for items available for swapping within a specific radius
- Integration with geolocation services to display nearby items

### Integrated Chat System
- Real-time messaging between users to negotiate swaps
- Notifications for new messages

### User Reviews and Ratings
- Leave reviews and ratings for each other after a swap
- Display average ratings on user profiles

### Environmental Impact Tracker
- Calculate and display the environmental impact of each swap
- Dashboard for users to track their overall impact

### User Profiles
- Create profiles, list items for swapping, and manage swap history

### Search and Filtering
- Search for items by category
- Filter by condition, distance, and availability

## Tech Stack

### Frontend
- React.js
- Material-UI
- React Router
- Socket.IO Client
- Axios
- Formik & Yup

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- bcrypt

## Project Structure

```
ecoswap/
├── backend/                 # Backend server code
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
│
├── frontend/                # Frontend React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main App component
│   │   ├── index.js         # Entry point
│   │   └── theme.js         # Material-UI theme
│   └── package.json         # Frontend dependencies
│
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecoswap.git
   cd ecoswap
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecoswap

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Google Maps API Key (for geolocation)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### User Endpoints

- `GET /api/users/:id` - Get user profile by ID
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/items` - Get user items
- `GET /api/users/:id/swaps` - Get user swaps
- `GET /api/users/:id/reviews` - Get user reviews
- `GET /api/users/nearby` - Get nearby users
- `GET /api/users/:id/impact` - Get user environmental impact

### Item Endpoints

- `POST /api/items` - Create a new item
- `GET /api/items` - Get all items with filtering
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/interest` - Express interest in an item
- `GET /api/items/nearby` - Get nearby items

### Swap Endpoints

- `POST /api/swaps` - Create a new swap request
- `GET /api/swaps` - Get all swaps for current user
- `GET /api/swaps/:id` - Get swap by ID
- `PUT /api/swaps/:id/status` - Update swap status
- `GET /api/swaps/:id/impact` - Get swap environmental impact

### Message Endpoints

- `POST /api/messages` - Send a new message
- `GET /api/messages/:swapId` - Get messages for a swap
- `GET /api/messages/unread` - Get unread message count
- `PUT /api/messages/:swapId/read` - Mark messages as read

### Review Endpoints

- `POST /api/reviews` - Create a new review
- `GET /api/reviews/user/:userId` - Get reviews for a user
- `GET /api/reviews/swap/:swapId` - Get reviews for a swap
- `PUT /api/reviews/:id` - Update a review

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.