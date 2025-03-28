import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Paper,
  Divider,
  Avatar
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  LocationOn as LocationIcon,
  Chat as ChatIcon,
  StarRate as StarIcon,
  Nature as EcoIcon,
  Search as SearchIcon,
  AddCircle as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Feature card component
const FeatureCard = ({ icon, title, description }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
      <Box sx={{ mb: 2, color: 'primary.main' }}>
        {icon}
      </Box>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

// Testimonial card component
const TestimonialCard = ({ name, location, avatar, rating, text }) => (
  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Avatar src={avatar} sx={{ mr: 2 }}>
        {name.charAt(0)}
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {location}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            fontSize="small"
            sx={{ color: i < rating ? 'warning.main' : 'text.disabled' }}
          />
        ))}
      </Box>
    </Box>
    <Typography variant="body1">"{text}"</Typography>
  </Paper>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  // Features data
  const features = [
    {
      icon: <SwapIcon fontSize="large" />,
      title: "Swap, Don't Shop",
      description: "Exchange your unused items with others in your community, reducing waste and saving money."
    },
    {
      icon: <LocationIcon fontSize="large" />,
      title: 'Location-Based',
      description: 'Find items available for swapping within your area, making exchanges convenient and eco-friendly.'
    },
    {
      icon: <ChatIcon fontSize="large" />,
      title: 'Integrated Chat',
      description: 'Communicate directly with other users to negotiate swaps and arrange meetups.'
    },
    {
      icon: <StarIcon fontSize="large" />,
      title: 'User Reviews',
      description: 'Build trust in the community with ratings and reviews after successful swaps.'
    },
    {
      icon: <EcoIcon fontSize="large" />,
      title: 'Environmental Impact',
      description: 'Track your positive impact on the environment with every swap you make.'
    },
    {
      icon: <SearchIcon fontSize="large" />,
      title: 'Smart Search',
      description: 'Find exactly what you need with powerful search and filtering options.'
    }
  ];
  
  // Testimonials data
  // Example testimonials - what future users might say
  const testimonials = [
    {
      name: 'Example User',
      location: 'Portland, OR',
      avatar: '',
      rating: 5,
      text: "EcoSwap could change how people think about shopping. Users might swap many items and save money while reducing their carbon footprint!"
    },
    {
      name: 'Example User',
      location: 'Austin, TX',
      avatar: '',
      rating: 4,
      text: "The environmental impact tracker would be rewarding. Users could see how much CO2 they've saved by swapping instead of buying new items."
    },
    {
      name: 'Example User',
      location: 'Chicago, IL',
      avatar: '',
      rating: 5,
      text: "A community like this could be amazing! Users might meet like-minded people who care about sustainability as much as they do."
    }
  ];
  
  return (
    <Box>
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
      
      {/* Hero section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          borderRadius: { xs: 0, sm: 2 },
          mt: 2,
          boxShadow: 1,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="primary"
            gutterBottom
            fontWeight="bold"
          >
            Swap, Don't Shop
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Join the sustainable revolution. EcoSwap connects you with people in your area
            to swap unused or lightly-used items, reducing waste and building community.
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/items"
                  startIcon={<SearchIcon />}
                >
                  Browse Items
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/dashboard/items/add"
                  startIcon={<AddIcon />}
                >
                  Add Item to Swap
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                >
                  Join EcoSwap
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/items"
                >
                  Browse Items
                </Button>
              </>
            )}
          </Stack>
        </Container>
      </Box>
      
      {/* Stats section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary" fontWeight="bold">
                Join Now
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Be an Early Adopter
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary" fontWeight="bold">
                Start Swapping
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Add Your First Item
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary" fontWeight="bold">
                Make an Impact
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Help the Environment
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Divider />
      
      {/* Features section */}
      <Container sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          How EcoSwap Works
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Our platform makes it easy to swap items and track your environmental impact.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Categories section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Popular Categories
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Discover items across various categories.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {['Clothing', 'Electronics', 'Furniture', 'Books', 'Toys', 'Sports'].map((category) => (
              <Grid item key={category} xs={6} sm={4} md={2}>
                <Card
                  component={RouterLink}
                  to={`/items?category=${category.toLowerCase()}`}
                  sx={{
                    height: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textDecoration: 'none',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" align="center">
                      {category}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials section */}
      <Container sx={{ py: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          What Users Could Say About EcoSwap
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Here's what users might say once they experience the benefits of EcoSwap.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {testimonials.map((testimonial, index) => (
            <Grid item key={index} xs={12} md={4}>
              <TestimonialCard
                name={testimonial.name}
                location={testimonial.location}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
                text={testimonial.text}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: { xs: 0, sm: 2 },
          mt: 4,
          mb: 4
        }}
      >
        <Container>
          <Typography
            component="h2"
            variant="h3"
            align="center"
            gutterBottom
          >
            Be Among the First to Start Swapping!
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Join our growing community and help build a more sustainable future.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/dashboard/items/add"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Add Your First Item
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/register"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100'
                  }
                }}
              >
                Sign Up Now
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;