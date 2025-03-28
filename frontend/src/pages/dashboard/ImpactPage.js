import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Nature as EcoIcon,
  Opacity as WaterIcon,
  Delete as WasteIcon,
  Co2 as Co2Icon,
  LocalFlorist as TreeIcon,
  Share as ShareIcon,
  EmojiEvents as AchievementIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data for environmental impact - starting with minimal data for new users
const mockImpactData = {
  user: {
    id: 101,
    name: 'New User'
  },
  totalSwaps: 0,
  totalImpact: {
    co2Saved: 0,
    wasteReduced: 0,
    waterSaved: 0,
    treesEquivalent: 0
  },
  monthlyImpact: {
    co2Saved: 0,
    wasteReduced: 0,
    waterSaved: 0,
    treesEquivalent: 0
  },
  swapsByCategory: [
    { category: 'clothing', count: 0, co2Saved: 0 },
    { category: 'electronics', count: 0, co2Saved: 0 },
    { category: 'furniture', count: 0, co2Saved: 0 },
    { category: 'books', count: 0, co2Saved: 0 },
    { category: 'toys', count: 0, co2Saved: 0 },
    { category: 'sports', count: 0, co2Saved: 0 }
  ],
  achievements: [
    { id: 1, title: 'First Swap', description: 'Complete your first item swap', achieved: false, progress: 0 },
    { id: 2, title: 'Eco Warrior', description: 'Save over 100kg of CO2 through swapping', achieved: false, progress: 0 },
    { id: 3, title: 'Swap Master', description: 'Complete 20 successful swaps', achieved: false, progress: 0 },
    { id: 4, title: 'Category Collector', description: 'Swap items in at least 5 different categories', achieved: false, progress: 0 },
    { id: 5, title: 'Sustainability Champion', description: 'Save over 200kg of CO2 through swapping', achieved: false, progress: 0 }
  ],
  monthlyStats: [
    { month: 'Jan', co2Saved: 0, swaps: 0 },
    { month: 'Feb', co2Saved: 0, swaps: 0 },
    { month: 'Mar', co2Saved: 0, swaps: 0 },
    { month: 'Apr', co2Saved: 0, swaps: 0 },
    { month: 'May', co2Saved: 0, swaps: 0 },
    { month: 'Jun', co2Saved: 0, swaps: 0 },
    { month: 'Jul', co2Saved: 0, swaps: 0 },
    { month: 'Aug', co2Saved: 0, swaps: 0 },
    { month: 'Sep', co2Saved: 0, swaps: 0 },
    { month: 'Oct', co2Saved: 0, swaps: 0 },
    { month: 'Nov', co2Saved: 0, swaps: 0 },
    { month: 'Dec', co2Saved: 0, swaps: 0 }
  ]
};

// Impact stat card component
const ImpactStatCard = ({ icon, title, value, unit, color, description }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}.lightest`,
            color: `${color}.main`,
            borderRadius: '50%',
            p: 1,
            mr: 2
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value.toLocaleString()} <Typography variant="body2" component="span">{unit}</Typography>
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </CardContent>
  </Card>
);

// Achievement card component
const AchievementCard = ({ achievement }) => (
  <Card sx={{ mb: 2, bgcolor: achievement.achieved ? 'success.lightest' : 'background.paper' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AchievementIcon 
          color={achievement.achieved ? 'success' : 'disabled'} 
          sx={{ mr: 1 }} 
        />
        <Typography variant="subtitle1" fontWeight="bold">
          {achievement.title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        {achievement.description}
      </Typography>
      {achievement.achieved ? (
        <Typography variant="caption" color="success.main">
          Achieved on {new Date(achievement.date).toLocaleDateString()}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={(achievement.progress / 200) * 100} 
              color="primary" 
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {achievement.progress}/200
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const ImpactPage = () => {
  const { user } = useAuth();
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  // Fetch impact data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setImpactData(mockImpactData);
      setLoading(false);
    }, 500);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Environmental Impact
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
        >
          Share My Impact
        </Button>
      </Box>
      
      {/* Impact summary */}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'success.lightest' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EcoIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Your Future Sustainability Impact
            </Typography>
            <Typography variant="body1">
              Start swapping items to track your positive impact on the environment. Each swap helps reduce waste and CO2 emissions!
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Impact stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactStatCard
            icon={<Co2Icon />}
            title="CO2 Saved"
            value={impactData.totalImpact.co2Saved}
            unit="kg"
            color="success"
            description="Equivalent to driving 780 fewer kilometers"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactStatCard
            icon={<WasteIcon />}
            title="Waste Reduced"
            value={impactData.totalImpact.wasteReduced}
            unit="kg"
            color="warning"
            description="Kept out of landfills through reuse"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactStatCard
            icon={<WaterIcon />}
            title="Water Saved"
            value={impactData.totalImpact.waterSaved}
            unit="L"
            color="info"
            description="Water conserved from new production"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <ImpactStatCard
            icon={<TreeIcon />}
            title="Trees Equivalent"
            value={impactData.totalImpact.treesEquivalent}
            unit="trees"
            color="success"
            description="CO2 absorption equivalent to trees"
          />
        </Grid>
      </Grid>
      
      {/* Tabs for detailed stats */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="By Category" />
          <Tab label="Monthly Stats" />
          <Tab label="Achievements" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Category tab */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Swaps by Category
                </Typography>
                <List>
                  {impactData.swapsByCategory.map((category) => (
                    <React.Fragment key={category.category}>
                      <ListItem>
                        <ListItemIcon>
                          <EcoIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography sx={{ textTransform: 'capitalize' }}>
                              {category.category}
                            </Typography>
                          }
                          secondary={`${category.count} swaps`}
                        />
                        <Typography variant="body2" color="success.main">
                          {category.co2Saved} kg CO2 saved
                        </Typography>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Impact Breakdown
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    [Category impact chart would be displayed here]
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
          
          {/* Monthly stats tab */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Monthly CO2 Savings
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    [Monthly CO2 savings chart would be displayed here]
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Monthly Swaps
                </Typography>
                <List>
                  {impactData.monthlyStats.slice(0, 6).map((month) => (
                    <React.Fragment key={month.month}>
                      <ListItem>
                        <ListItemText
                          primary={month.month}
                          secondary={`${month.swaps} swaps`}
                        />
                        <Typography variant="body2" color="success.main">
                          {month.co2Saved} kg CO2 saved
                        </Typography>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
          
          {/* Achievements tab */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Your Achievements
                </Typography>
                {impactData.achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'primary.lightest', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Getting Started
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Add your first item and complete your first swap to begin tracking your environmental impact!
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <TimelineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="First milestone"
                          secondary="Complete your first swap"
                        />
                      </ListItem>
                      <ListItem>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={0}
                            color="primary"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          0%
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
      {/* Environmental tips */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tips to Increase Your Impact
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  List More Items
                </Typography>
                <Typography variant="body2">
                  The more items you list, the more opportunities for swaps and environmental savings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Focus on High-Impact Categories
                </Typography>
                <Typography variant="body2">
                  Electronics and furniture swaps typically have the highest environmental impact.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Share Your Impact
                </Typography>
                <Typography variant="body2">
                  Inspire others by sharing your environmental impact on social media.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ImpactPage;