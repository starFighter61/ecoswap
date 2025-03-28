import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Chip,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  SwapHoriz as SwapIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Mock data for swaps
const mockSwaps = [
  {
    id: 301,
    status: 'pending',
    date: '2023-02-18T14:20:00Z',
    direction: 'incoming',
    item: {
      id: 1,
      title: 'Vintage Leather Jacket',
      description: 'Genuine leather jacket in excellent condition. Size M.',
      image: 'https://via.placeholder.com/300x200?text=Leather+Jacket'
    },
    otherItem: {
      id: 5,
      title: 'Plant Collection',
      description: 'Set of 5 small indoor plants. Perfect for beginners.',
      image: 'https://via.placeholder.com/300x200?text=Plant+Collection'
    },
    user: {
      id: 102,
      name: 'Michael Chen',
      avatar: 'https://via.placeholder.com/50?text=MC',
      rating: 4.6
    },
    messages: 3,
    unreadMessages: 2
  },
  {
    id: 302,
    status: 'accepted',
    date: '2023-02-16T09:15:00Z',
    direction: 'outgoing',
    item: {
      id: 11,
      title: 'Yoga Mat',
      description: 'High-quality yoga mat, 6mm thick. Used only a few times.',
      image: 'https://via.placeholder.com/300x200?text=Yoga+Mat'
    },
    otherItem: {
      id: 6,
      title: 'Board Game Collection',
      description: 'Collection of 10 popular board games. All complete with instructions.',
      image: 'https://via.placeholder.com/300x200?text=Board+Games'
    },
    user: {
      id: 103,
      name: 'Emma Rodriguez',
      avatar: 'https://via.placeholder.com/50?text=ER',
      rating: 4.9
    },
    messages: 5,
    unreadMessages: 0,
    meetupDate: '2023-02-25T15:00:00Z',
    meetupLocation: 'Central Park Coffee Shop'
  },
  {
    id: 303,
    status: 'completed',
    date: '2023-01-28T11:30:00Z',
    direction: 'outgoing',
    item: {
      id: 8,
      title: 'Bluetooth Headphones',
      description: 'Wireless headphones with noise cancellation. Great battery life.',
      image: 'https://via.placeholder.com/300x200?text=Headphones'
    },
    otherItem: {
      id: 9,
      title: 'Hiking Backpack',
      description: '40L hiking backpack, waterproof and durable.',
      image: 'https://via.placeholder.com/300x200?text=Backpack'
    },
    user: {
      id: 104,
      name: 'David Kim',
      avatar: 'https://via.placeholder.com/50?text=DK',
      rating: 4.7
    },
    messages: 8,
    unreadMessages: 0,
    completedDate: '2023-02-05T14:00:00Z',
    review: {
      given: true,
      received: true
    }
  },
  {
    id: 304,
    status: 'declined',
    date: '2023-01-20T16:45:00Z',
    direction: 'incoming',
    item: {
      id: 10,
      title: 'Ceramic Plant Pots',
      description: 'Set of 3 ceramic plant pots in different sizes.',
      image: 'https://via.placeholder.com/300x200?text=Plant+Pots'
    },
    otherItem: {
      id: 12,
      title: 'Desk Lamp',
      description: 'Adjustable desk lamp with multiple brightness settings.',
      image: 'https://via.placeholder.com/300x200?text=Desk+Lamp'
    },
    user: {
      id: 105,
      name: 'Sophia Lee',
      avatar: 'https://via.placeholder.com/50?text=SL',
      rating: 4.5
    },
    messages: 2,
    unreadMessages: 0,
    declinedReason: 'Item no longer available'
  },
  {
    id: 305,
    status: 'cancelled',
    date: '2023-01-15T10:20:00Z',
    direction: 'outgoing',
    item: {
      id: 13,
      title: 'Coffee Table Books',
      description: 'Collection of coffee table books on architecture and design.',
      image: 'https://via.placeholder.com/300x200?text=Books'
    },
    otherItem: {
      id: 14,
      title: 'Portable Bluetooth Speaker',
      description: 'Compact speaker with great sound quality.',
      image: 'https://via.placeholder.com/300x200?text=Speaker'
    },
    user: {
      id: 106,
      name: 'James Wilson',
      avatar: 'https://via.placeholder.com/50?text=JW',
      rating: 4.3
    },
    messages: 4,
    unreadMessages: 0,
    cancelledReason: 'Changed my mind'
  }
];

// Swap card component
const SwapCard = ({ swap }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" icon={<TimeIcon />} />;
      case 'accepted':
        return <Chip label="Accepted" color="info" size="small" icon={<CheckCircleIcon />} />;
      case 'completed':
        return <Chip label="Completed" color="success" size="small" icon={<CheckCircleIcon />} />;
      case 'declined':
        return <Chip label="Declined" color="error" size="small" icon={<CancelIcon />} />;
      case 'cancelled':
        return <Chip label="Cancelled" color="default" size="small" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Swap #{swap.id}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {formatDate(swap.date)}
            </Typography>
          </Box>
          {getStatusChip(swap.status)}
        </Box>
        
        <Grid container spacing={2}>
          {/* User info */}
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar
                src={swap.user.avatar}
                alt={swap.user.name}
                sx={{ width: 64, height: 64, mb: 1 }}
              />
              <Typography variant="subtitle2">
                {swap.user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Rating: {swap.user.rating}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ChatIcon />}
                component={RouterLink}
                to={`/dashboard/chat/${swap.id}`}
                sx={{ mt: 1 }}
              >
                {swap.unreadMessages > 0 ? (
                  <Badge badgeContent={swap.unreadMessages} color="error">
                    Chat
                  </Badge>
                ) : (
                  'Chat'
                )}
              </Button>
            </Box>
          </Grid>
          
          {/* Items */}
          <Grid item xs={12} sm={9}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
              {/* Your item */}
              <Box sx={{ flex: 1, width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {swap.direction === 'outgoing' ? 'Your Item' : 'Their Item'}
                </Typography>
                <Card variant="outlined" sx={{ display: 'flex', height: 120 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120 }}
                    image={swap.item.image}
                    alt={swap.item.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {swap.item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {swap.item.description}
                    </Typography>
                  </Box>
                </Card>
              </Box>
              
              {/* Arrow */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                p: 2,
                transform: { xs: 'rotate(90deg)', md: 'rotate(0deg)' }
              }}>
                <SwapIcon color="primary" fontSize="large" />
              </Box>
              
              {/* Their item */}
              <Box sx={{ flex: 1, width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {swap.direction === 'outgoing' ? 'Their Item' : 'Your Item'}
                </Typography>
                <Card variant="outlined" sx={{ display: 'flex', height: 120 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120 }}
                    image={swap.otherItem.image}
                    alt={swap.otherItem.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', p: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {swap.otherItem.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {swap.otherItem.description}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Box>
            
            {/* Additional info based on status */}
            {swap.status === 'accepted' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.lightest', borderRadius: 1 }}>
                <Typography variant="subtitle2">
                  Meetup Details:
                </Typography>
                <Typography variant="body2">
                  {formatDate(swap.meetupDate)} at {formatTime(swap.meetupDate)}, {swap.meetupLocation}
                </Typography>
              </Box>
            )}
            
            {swap.status === 'completed' && !swap.review.given && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  component={RouterLink}
                  to={`/dashboard/review/${swap.id}`}
                >
                  Leave Review
                </Button>
              </Box>
            )}
            
            {swap.status === 'declined' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'error.lightest', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error">
                  Reason for declining:
                </Typography>
                <Typography variant="body2">
                  {swap.declinedReason}
                </Typography>
              </Box>
            )}
            
            {swap.status === 'cancelled' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'action.disabledBackground', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Reason for cancellation:
                </Typography>
                <Typography variant="body2">
                  {swap.cancelledReason}
                </Typography>
              </Box>
            )}
            
            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                component={RouterLink}
                to={`/dashboard/swaps/${swap.id}`}
              >
                View Details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const MySwapsPage = () => {
  const [swaps, setSwaps] = useState([]);
  const [filteredSwaps, setFilteredSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');

  // Fetch swaps on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setSwaps(mockSwaps);
      setFilteredSwaps(mockSwaps);
      setLoading(false);
    }, 500);
  }, []);

  // Filter swaps when search term or filters change
  useEffect(() => {
    if (swaps.length > 0) {
      let filtered = [...swaps];
      
      // Filter by tab (status group)
      if (tabValue === 0) { // Active
        filtered = filtered.filter(swap => ['pending', 'accepted'].includes(swap.status));
      } else if (tabValue === 1) { // Completed
        filtered = filtered.filter(swap => swap.status === 'completed');
      } else if (tabValue === 2) { // Cancelled/Declined
        filtered = filtered.filter(swap => ['cancelled', 'declined'].includes(swap.status));
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(swap => 
          swap.item.title.toLowerCase().includes(term) ||
          swap.otherItem.title.toLowerCase().includes(term) ||
          swap.user.name.toLowerCase().includes(term)
        );
      }
      
      // Filter by specific status
      if (statusFilter !== 'all') {
        filtered = filtered.filter(swap => swap.status === statusFilter);
      }
      
      // Filter by direction
      if (directionFilter !== 'all') {
        filtered = filtered.filter(swap => swap.direction === directionFilter);
      }
      
      setFilteredSwaps(filtered);
    }
  }, [swaps, tabValue, searchTerm, statusFilter, directionFilter]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDirectionFilter('all');
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading your swaps...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Swaps
      </Typography>
      
      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Active</Typography>
                <Chip 
                  label={swaps.filter(swap => ['pending', 'accepted'].includes(swap.status)).length} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Completed</Typography>
                <Chip 
                  label={swaps.filter(swap => swap.status === 'completed').length} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Cancelled/Declined</Typography>
                <Chip 
                  label={swaps.filter(swap => ['cancelled', 'declined'].includes(swap.status)).length} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Box>
            } 
          />
        </Tabs>
      </Paper>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Search Swaps"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by item name or user"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="declined">Declined</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Direction</InputLabel>
              <Select
                value={directionFilter}
                label="Direction"
                onChange={(e) => setDirectionFilter(e.target.value)}
              >
                <MenuItem value="all">All Directions</MenuItem>
                <MenuItem value="incoming">Incoming Requests</MenuItem>
                <MenuItem value="outgoing">Outgoing Requests</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Tooltip title="Reset Filters">
              <IconButton 
                onClick={handleResetFilters}
                color="primary"
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Swaps list */}
      {filteredSwaps.length > 0 ? (
        filteredSwaps.map(swap => (
          <SwapCard key={swap.id} swap={swap} />
        ))
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No swaps found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {swaps.length > 0 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'You haven\'t made any swap requests yet. Browse items to find something to swap!'}
          </Typography>
          {swaps.length === 0 && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/items"
              sx={{ mt: 2 }}
            >
              Browse Items
            </Button>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default MySwapsPage;