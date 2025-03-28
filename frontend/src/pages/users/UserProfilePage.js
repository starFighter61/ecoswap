import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Divider,
  Rating,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  Star as StarIcon,
  Nature as EcoIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
  Report as ReportIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock user data
const mockUser = {
  id: 101,
  name: 'Sarah Johnson',
  location: 'Portland, OR',
  bio: 'Passionate about sustainability and reducing waste. I love finding new homes for items I no longer need and discovering unique pre-loved treasures from others.',
  avatar: 'https://via.placeholder.com/150?text=SJ',
  joinDate: '2022-05-10T00:00:00Z',
  stats: {
    rating: 4.8,
    completedSwaps: 23,
    listedItems: 15,
    co2Saved: 195.5
  }
};

// Mock items data
const mockItems = [
  {
    id: 1,
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket in excellent condition. Size M.',
    category: 'clothing',
    condition: 'lightly-used',
    location: 'Portland, OR',
    distance: 3.2,
    image: 'https://via.placeholder.com/300x200?text=Leather+Jacket'
  },
  {
    id: 10,
    title: 'Ceramic Plant Pots (Set of 3)',
    description: 'Beautiful ceramic pots in various sizes. Perfect for indoor plants.',
    category: 'home',
    condition: 'new',
    location: 'Portland, OR',
    distance: 3.2,
    image: 'https://via.placeholder.com/300x200?text=Plant+Pots'
  },
  {
    id: 11,
    title: 'Yoga Mat',
    description: 'High-quality yoga mat, 6mm thick. Used only a few times.',
    category: 'sports',
    condition: 'lightly-used',
    location: 'Portland, OR',
    distance: 3.2,
    image: 'https://via.placeholder.com/300x200?text=Yoga+Mat'
  }
];

// Mock reviews data
const mockReviews = [
  {
    id: 201,
    reviewer: {
      id: 102,
      name: 'Michael Chen',
      avatar: 'https://via.placeholder.com/50?text=MC'
    },
    rating: 5,
    date: '2023-01-15T00:00:00Z',
    text: 'Great swap experience! Sarah was punctual and the item was exactly as described. Would definitely swap with her again.'
  },
  {
    id: 202,
    reviewer: {
      id: 103,
      name: 'Emma Rodriguez',
      avatar: 'https://via.placeholder.com/50?text=ER'
    },
    rating: 5,
    date: '2022-11-28T00:00:00Z',
    text: 'Sarah is a pleasure to deal with. The swap was smooth and the item was in perfect condition.'
  },
  {
    id: 203,
    reviewer: {
      id: 104,
      name: 'David Kim',
      avatar: 'https://via.placeholder.com/50?text=DK'
    },
    rating: 4,
    date: '2022-10-05T00:00:00Z',
    text: 'Good communication and easy swap. The item had a small scratch that wasn\'t mentioned, but otherwise as described.'
  }
];

// Item card component
const ItemCard = ({ item }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
    <CardActionArea component={RouterLink} to={`/items/${item.id}`}>
      <CardMedia
        component="img"
        height="140"
        image={item.image}
        alt={item.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={item.category} 
            size="small" 
            sx={{ 
              bgcolor: 'primary.light', 
              color: 'white',
              textTransform: 'capitalize'
            }} 
          />
          <Chip 
            label={item.condition} 
            size="small" 
            sx={{ 
              bgcolor: 'secondary.light', 
              color: 'white',
              textTransform: 'capitalize'
            }} 
          />
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

// Review card component
const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar src={review.reviewer.avatar} sx={{ mr: 2 }}>
          {review.reviewer.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {review.reviewer.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={review.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {formatDate(review.date)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography variant="body1">
        "{review.text}"
      </Typography>
    </Paper>
  );
};

const UserProfilePage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Fetch user data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setUserData(mockUser);
      setItems(mockItems);
      setReviews(mockReviews);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading user profile...</Typography>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>User not found</Typography>
        <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const isOwnProfile = isAuthenticated && user?.id === userData.id;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left column - User info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={userData.avatar}
                alt={userData.name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {userData.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={userData.stats.rating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({userData.stats.rating})
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {userData.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Member since {formatDate(userData.joinDate)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              {userData.bio}
            </Typography>
            
            {!isOwnProfile && isAuthenticated && (
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                component={RouterLink}
                to={`/dashboard/messages?user=${userData.id}`}
                fullWidth
                sx={{ mb: 2 }}
              >
                Message
              </Button>
            )}
            
            {isOwnProfile && (
              <Button
                variant="outlined"
                component={RouterLink}
                to="/dashboard/settings"
                fullWidth
                sx={{ mb: 2 }}
              >
                Edit Profile
              </Button>
            )}
            
            {!isOwnProfile && (
              <Button
                variant="text"
                color="error"
                startIcon={<ReportIcon />}
                size="small"
                fullWidth
              >
                Report User
              </Button>
            )}
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Swap Stats
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <SwapIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${userData.stats.completedSwaps} Successful Swaps`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StarIcon sx={{ color: 'warning.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={`${userData.stats.rating} Average Rating`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EcoIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${userData.stats.co2Saved} kg CO2 Saved`} 
                  secondary="Through swapping instead of buying new"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Right column - Tabs for items and reviews */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={`Available Items (${items.length})`} />
              <Tab label={`Reviews (${reviews.length})`} />
            </Tabs>
          </Paper>
          
          {/* Items tab */}
          {tabValue === 0 && (
            <>
              {items.length > 0 ? (
                <Grid container spacing={3}>
                  {items.map((item) => (
                    <Grid item key={item.id} xs={12} sm={6} md={4}>
                      <ItemCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No items available for swapping at the moment.
                  </Typography>
                </Paper>
              )}
            </>
          )}
          
          {/* Reviews tab */}
          {tabValue === 1 && (
            <>
              {reviews.length > 0 ? (
                <Box>
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </Box>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No reviews yet.
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfilePage;