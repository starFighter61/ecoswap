import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Pagination,
  Stack,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Nature as EcoIcon
} from '@mui/icons-material';
import ItemService from '../../services/ItemService';
import { useNotification } from '../../context/NotificationContext';

// Item card component
const ItemCard = ({ item }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2 }}>
    <CardActionArea component={RouterLink} to={`/items/${item._id}`}>
      <CardMedia
        component="img"
        height="200"
        image={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={item.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.description}
        </Typography>
        {item.location && item.location.coordinates && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {item.distance ? `${item.distance.toFixed(1)} km away` : 'Location available'}
            </Typography>
          </Box>
        )}
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

const ItemsPage = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [distance, setDistance] = useState(50);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const { showNotification } = useNotification();

  // Mock data for items (fallback when API is unavailable)
  const mockItems = [
    {
      _id: '1',
      title: '[EXAMPLE] Vintage Leather Jacket',
      description: 'Genuine leather jacket in excellent condition. Size M.',
      category: 'clothing',
      condition: 'good',
      location: { coordinates: [-122.6765, 45.5231] },
      distance: 3.2,
      images: ['https://via.placeholder.com/300x200?text=Leather+Jacket'],
      owner: {
        _id: '101',
        firstName: 'Sarah',
        lastName: 'Johnson',
        rating: 4.8
      },
      environmentalImpact: {
        co2Saved: 8.5,
        wasteReduced: 2.3
      }
    },
    {
      _id: '2',
      title: '[EXAMPLE] Sony Headphones',
      description: 'Wireless noise-cancelling headphones. Great sound quality.',
      category: 'electronics',
      condition: 'like-new',
      location: { coordinates: [-122.6795, 45.5231] },
      distance: 1.5,
      images: ['https://via.placeholder.com/300x200?text=Sony+Headphones'],
      owner: {
        _id: '102',
        firstName: 'Michael',
        lastName: 'Chen',
        rating: 4.6
      },
      environmentalImpact: {
        co2Saved: 12.3,
        wasteReduced: 3.1
      }
    },
    {
      _id: '3',
      title: '[EXAMPLE] Coffee Table',
      description: 'Wooden coffee table with glass top. 40" x 24".',
      category: 'furniture',
      condition: 'good',
      location: { coordinates: [-122.6755, 45.5241] },
      distance: 4.7,
      images: ['https://via.placeholder.com/300x200?text=Coffee+Table'],
      owner: {
        _id: '103',
        firstName: 'Emma',
        lastName: 'Rodriguez',
        rating: 4.9
      },
      environmentalImpact: {
        co2Saved: 25.7,
        wasteReduced: 8.2
      }
    },
    {
      _id: '4',
      title: '[EXAMPLE] Mountain Bike',
      description: 'Trek mountain bike, 21-speed. Recently tuned up.',
      category: 'sports',
      condition: 'fair',
      location: { coordinates: [-122.6775, 45.5221] },
      distance: 2.8,
      images: ['https://via.placeholder.com/300x200?text=Mountain+Bike'],
      owner: {
        _id: '104',
        firstName: 'David',
        lastName: 'Kim',
        rating: 4.7
      },
      environmentalImpact: {
        co2Saved: 15.3,
        wasteReduced: 4.8
      }
    },
    {
      _id: '5',
      title: '[EXAMPLE] Plant Collection',
      description: 'Set of 5 small indoor plants. Perfect for beginners.',
      category: 'garden',
      condition: 'new',
      location: { coordinates: [-122.6785, 45.5211] },
      distance: 0.9,
      images: ['https://via.placeholder.com/300x200?text=Plant+Collection'],
      owner: {
        _id: '105',
        firstName: 'Sophia',
        lastName: 'Lee',
        rating: 5.0
      },
      environmentalImpact: {
        co2Saved: 5.2,
        wasteReduced: 1.7
      }
    },
    {
      _id: '6',
      title: '[EXAMPLE] Board Game Collection',
      description: 'Collection of 10 popular board games. All complete with instructions.',
      category: 'toys',
      condition: 'good',
      location: { coordinates: [-122.6745, 45.5251] },
      distance: 3.5,
      images: ['https://via.placeholder.com/300x200?text=Board+Games'],
      owner: {
        _id: '106',
        firstName: 'James',
        lastName: 'Wilson',
        rating: 4.5
      },
      environmentalImpact: {
        co2Saved: 7.8,
        wasteReduced: 2.5
      }
    }
  ];

  // Load items on component mount and when filters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Prepare filter parameters
        const filters = {
          page,
          limit: itemsPerPage,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        };
        
        if (category) filters.category = category;
        if (condition) filters.condition = condition;
        if (searchTerm) filters.search = searchTerm;
        
        // Get user's location for distance calculation
        if (navigator.geolocation && distance < 50) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              filters.latitude = latitude;
              filters.longitude = longitude;
              filters.radius = distance;
              
              try {
                const response = await ItemService.getItems(filters);
                handleItemsResponse(response);
              } catch (err) {
                console.error('API error, falling back to mock data:', err);
                handleMockData();
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              fetchItemsWithoutLocation(filters);
            }
          );
        } else {
          fetchItemsWithoutLocation(filters);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        handleMockData();
      }
    };
    
    const fetchItemsWithoutLocation = async (filters) => {
      try {
        const response = await ItemService.getItems(filters);
        handleItemsResponse(response);
      } catch (err) {
        console.error('Error fetching items without location, falling back to mock data:', err);
        handleMockData();
      }
    };
    
    const handleItemsResponse = (response) => {
      if (response && response.data) {
        setItems(response.data.items);
        setTotalItems(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);
      } else {
        handleMockData();
      }
      setLoading(false);
    };
    
    const handleMockData = () => {
      // Filter mock data based on current filters
      const filtered = mockItems.filter(item => {
        return (
          (searchTerm === '' ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (category === '' || item.category === category) &&
          (condition === '' || item.condition === condition) &&
          item.distance <= distance
        );
      });
      
      setItems(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setError('Using mock data - MongoDB connection not available');
      setLoading(false);
    };
    
    fetchItems();
  }, [page, category, condition, searchTerm, distance, showNotification, itemsPerPage]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Items
      </Typography>
      
      {/* Search and filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Items"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="furniture">Furniture</MenuItem>
                  <MenuItem value="books">Books</MenuItem>
                  <MenuItem value="toys">Toys</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="kitchen">Kitchen</MenuItem>
                  <MenuItem value="garden">Garden</MenuItem>
                  <MenuItem value="automotive">Automotive</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={condition}
                  label="Condition"
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <MenuItem value="">All Conditions</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="like-new">Like New</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="fair">Fair</MenuItem>
                  <MenuItem value="poor">Poor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ width: '100%' }}>
                <Typography gutterBottom>
                  Distance: {distance} km
                </Typography>
                <Slider
                  value={distance}
                  onChange={(e, newValue) => setDistance(newValue)}
                  min={1}
                  max={50}
                  valueLabelDisplay="auto"
                  aria-labelledby="distance-slider"
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Information banner */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          Welcome to EcoSwap!
        </Typography>
        <Typography variant="body1">
          This application is now connected to a real database. Add your own items to start swapping!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/dashboard/items/add"
          sx={{ mt: 2 }}
        >
          Add Your First Item
        </Button>
      </Paper>
      
      {/* Results count and environmental impact */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle1">
          {loading ? 'Loading items...' : `${totalItems} items found`}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EcoIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" color="success.main">
            Potential CO2 savings: ~{totalItems * 5} kg
          </Typography>
        </Box>
      </Box>
      
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Mock data warning */}
      {error && error.includes('mock data') && !loading && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
          <Typography variant="h6" gutterBottom>
            ⚠️ Example Items Only - Not Available for Swap
          </Typography>
          <Typography variant="body1">
            The items shown below are examples only and are not available for actual swapping.
            These are displayed because the application is currently using mock data.
            Please add your own items to start real swapping!
          </Typography>
          <Button
            variant="contained"
            color="warning"
            sx={{ mt: 2 }}
            component={RouterLink}
            to="/dashboard/items/add"
          >
            Add Real Items
          </Button>
        </Paper>
      )}
      
      {/* Error message */}
      {error && !error.includes('mock data') && !loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error" paragraph>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      )}
      
      {/* Items grid */}
      {!loading && !error && items.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {items.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <ItemCard item={item} />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Stack spacing={2} sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </>
      ) : !loading && !error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" paragraph>
            No items found matching your criteria.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSearchTerm('');
              setCategory('');
              setCondition('');
              setDistance(50);
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : null}
    </Container>
  );
};

export default ItemsPage;