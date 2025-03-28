import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  SwapHoriz as SwapIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Nature as EcoIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data for dashboard
const mockDashboardData = {
  user: {
    id: 101,
    name: 'Sarah Johnson',
    avatar: 'https://via.placeholder.com/150?text=SJ',
    location: 'Portland, OR'
  },
  stats: {
    listedItems: 15,
    activeSwaps: 3,
    completedSwaps: 23,
    unreadMessages: 2,
    co2Saved: 195.5,
    wasteReduced: 45.2
  },
  recentItems: [
    {
      id: 1,
      title: 'Vintage Leather Jacket',
      image: 'https://via.placeholder.com/300x200?text=Leather+Jacket',
      date: `${new Date().getFullYear()}-03-15T08:00:00Z`
    },
    {
      id: 10,
      title: 'Ceramic Plant Pots (Set of 3)',
      image: 'https://via.placeholder.com/300x200?text=Plant+Pots',
      date: `${new Date().getFullYear()}-03-10T10:30:00Z`
    }
  ],
  pendingSwaps: [
    {
      id: 301,
      item: {
        id: 1,
        title: 'Vintage Leather Jacket',
        image: 'https://via.placeholder.com/300x200?text=Leather+Jacket'
      },
      user: {
        id: 102,
        name: 'Michael Chen',
        avatar: 'https://via.placeholder.com/50?text=MC'
      },
      status: 'pending',
      date: `${new Date().getFullYear()}-03-18T14:20:00Z`
    },
    {
      id: 302,
      item: {
        id: 11,
        title: 'Yoga Mat',
        image: 'https://via.placeholder.com/300x200?text=Yoga+Mat'
      },
      user: {
        id: 103,
        name: 'Emma Rodriguez',
        avatar: 'https://via.placeholder.com/50?text=ER'
      },
      status: 'accepted',
      date: `${new Date().getFullYear()}-03-16T09:15:00Z`
    }
  ],
  notifications: [
    {
      id: 401,
      type: 'swap_request',
      message: 'Michael Chen requested to swap for your Vintage Leather Jacket',
      date: `${new Date().getFullYear()}-03-18T14:20:00Z`,
      read: false
    },
    {
      id: 402,
      type: 'message',
      message: 'New message from Emma Rodriguez',
      date: `${new Date().getFullYear()}-03-17T11:45:00Z`,
      read: false
    },
    {
      id: 403,
      type: 'swap_accepted',
      message: 'Emma Rodriguez accepted your swap request for Yoga Mat',
      date: `${new Date().getFullYear()}-03-16T09:15:00Z`,
      read: true
    }
  ]
};

// Dashboard menu items
const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    color: 'primary.main'
  },
  {
    title: 'My Items',
    icon: <InventoryIcon />,
    path: '/dashboard/items',
    color: 'secondary.main'
  },
  {
    title: 'My Swaps',
    icon: <SwapIcon />,
    path: '/dashboard/swaps',
    color: 'success.main'
  },
  {
    title: 'Messages',
    icon: <MessageIcon />,
    path: '/dashboard/messages',
    color: 'info.main'
  },
  {
    title: 'Environmental Impact',
    icon: <EcoIcon />,
    path: '/dashboard/impact',
    color: 'success.dark'
  },
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    path: '/dashboard/settings',
    color: 'text.secondary'
  }
];

// Notification item component
const NotificationItem = ({ notification }) => {
  const formatDate = (dateString) => {
    // Always use current year and recent dates
    const date = new Date(dateString);
    date.setFullYear(new Date().getFullYear());
    
    // Make dates appear recent
    const now = new Date();
    const diffDays = Math.floor(Math.random() * 7); // Random number of days between 0-6
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  let icon;
  let color;
  
  switch (notification.type) {
    case 'swap_request':
      icon = <SwapIcon />;
      color = 'primary';
      break;
    case 'message':
      icon = <MessageIcon />;
      color = 'info';
      break;
    case 'swap_accepted':
      icon = <StarIcon />;
      color = 'success';
      break;
    default:
      icon = <NotificationsIcon />;
      color = 'default';
  }

  return (
    <ListItem 
      sx={{ 
        bgcolor: notification.read ? 'transparent' : 'action.hover',
        borderRadius: 1
      }}
    >
      <ListItemIcon sx={{ color: `${color}.main` }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={notification.message} 
        secondary={formatDate(notification.date)}
      />
      {!notification.read && (
        <Chip 
          label="New" 
          size="small" 
          color="primary" 
          sx={{ ml: 1 }}
        />
      )}
    </ListItem>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    if (user) {
      // Use real user data from AuthContext and update mock data with current dates
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      
      // Update dates to current year
      const updatedRecentItems = mockDashboardData.recentItems.map(item => ({
        ...item,
        date: new Date(currentYear, currentMonth - 1, Math.floor(Math.random() * 28) + 1).toISOString()
      }));
      
      const updatedPendingSwaps = mockDashboardData.pendingSwaps.map(swap => ({
        ...swap,
        date: new Date(currentYear, currentMonth, Math.floor(Math.random() * 28) + 1).toISOString()
      }));
      
      const updatedNotifications = mockDashboardData.notifications.map(notification => ({
        ...notification,
        date: new Date(currentYear, currentMonth, Math.floor(Math.random() * 28) + 1).toISOString()
      }));
      
      const realDashboardData = {
        ...mockDashboardData,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.profilePicture,
          location: user.location?.address?.city ? `${user.location.address.city}, ${user.location.address.state}` : 'Your Location'
        },
        recentItems: updatedRecentItems,
        pendingSwaps: updatedPendingSwaps,
        notifications: updatedNotifications
      };
      
      setDashboardData(realDashboardData);
    }
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    // Always use current year regardless of the date string
    const date = new Date(dateString);
    date.setFullYear(new Date().getFullYear());
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Mock data notice */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="body2">
          <strong>Note:</strong> Some example data is shown below. Add your own items to see real data!
        </Typography>
      </Paper>
      
      {/* Welcome section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={dashboardData.user.avatar}
            alt={dashboardData.user.name}
            sx={{ width: 64, height: 64, mr: 2 }}
          />
          <Box>
            <Typography variant="h5" gutterBottom>
              Welcome back, {dashboardData.user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {dashboardData.user.location} • {formatDate(new Date().toISOString())}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/dashboard/items/add"
            sx={{ ml: 'auto' }}
          >
            Add New Item
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Left column - Menu and stats */}
        <Grid item xs={12} md={4}>
          {/* Dashboard menu */}
          <Paper sx={{ mb: 4 }}>
            <List>
              {menuItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <ListItem 
                    button
                    component={RouterLink}
                    to={item.path}
                    selected={item.path === '/dashboard'}
                  >
                    <ListItemIcon sx={{ color: item.color }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.title === 'Messages' && dashboardData.stats.unreadMessages > 0 && (
                      <Chip 
                        label={dashboardData.stats.unreadMessages} 
                        size="small" 
                        color="primary" 
                      />
                    )}
                  </ListItem>
                  {index < menuItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Stats */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Your Stats
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <InventoryIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${dashboardData.stats.listedItems} Listed Items`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SwapIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${dashboardData.stats.activeSwaps} Active Swaps`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StarIcon sx={{ color: 'warning.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={`${dashboardData.stats.completedSwaps} Completed Swaps`} 
                />
              </ListItem>
            </List>
          </Paper>

          {/* Environmental impact */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EcoIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Environmental Impact
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                CO2 Saved
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(dashboardData.stats.co2Saved / 200) * 100} 
                    color="success"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.stats.co2Saved} kg
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" gutterBottom>
                Waste Reduced
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(dashboardData.stats.wasteReduced / 50) * 100} 
                    color="secondary"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.stats.wasteReduced} kg
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/dashboard/impact"
              fullWidth
              sx={{ mt: 2 }}
            >
              View Full Impact
            </Button>
          </Paper>
        </Grid>

        {/* Right column - Recent activity */}
        <Grid item xs={12} md={8}>
          {/* Recent items */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Your Recent Items
              </Typography>
              <Button 
                component={RouterLink} 
                to="/dashboard/items"
                size="small"
              >
                View All
              </Button>
            </Box>
            <Grid container spacing={2}>
              {dashboardData.recentItems.map((item) => (
                <Grid item key={item.id} xs={12} sm={6}>
                  <Card>
                    <CardActionArea 
                      component={RouterLink} 
                      to={`/items/${item.id}`}
                      sx={{ display: 'flex', height: 100 }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{ width: 100, height: 100, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" noWrap>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Added on {formatDate(item.date)}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12} sm={6}>
                <Card 
                  sx={{ 
                    height: 100, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    bgcolor: 'action.hover',
                    border: '2px dashed',
                    borderColor: 'divider'
                  }}
                >
                  <CardActionArea 
                    component={RouterLink} 
                    to="/dashboard/items/add"
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <AddIcon color="primary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle1" color="primary">
                      Add New Item
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Pending swaps */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Pending Swaps
              </Typography>
              <Button 
                component={RouterLink} 
                to="/dashboard/swaps"
                size="small"
              >
                View All
              </Button>
            </Box>
            {dashboardData.pendingSwaps.length > 0 ? (
              <Grid container spacing={2}>
                {dashboardData.pendingSwaps.map((swap) => (
                  <Grid item key={swap.id} xs={12}>
                    <Card>
                      <CardActionArea 
                        component={RouterLink} 
                        to={`/dashboard/swaps/${swap.id}`}
                      >
                        <Box sx={{ display: 'flex', p: 2 }}>
                          <Box
                            component="img"
                            src={swap.item.image}
                            alt={swap.item.title}
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                          />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">
                              {swap.item.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar 
                                src={swap.user.avatar} 
                                alt={swap.user.name}
                                sx={{ width: 24, height: 24, mr: 1 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                {swap.user.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(swap.date)}
                              </Typography>
                              <Chip 
                                label={swap.status === 'pending' ? 'Pending' : 'Accepted'} 
                                size="small" 
                                color={swap.status === 'pending' ? 'warning' : 'success'} 
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 2 }}>
                No pending swaps at the moment.
              </Typography>
            )}
          </Paper>

          {/* Notifications */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Notifications
              </Typography>
              <Button size="small">
                Mark All as Read
              </Button>
            </Box>
            <List>
              {dashboardData.notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <NotificationItem notification={notification} />
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;