import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  SwapHoriz as SwapIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Nature as EcoIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Navigation items
const publicNavItems = [
  { name: 'Home', path: '/' },
  { name: 'Browse Items', path: '/items' },
  { name: 'About', path: '/about' }
];

const userNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { name: 'My Items', path: '/dashboard/items', icon: <InventoryIcon /> },
  { name: 'My Swaps', path: '/dashboard/swaps', icon: <SwapIcon /> },
  { name: 'Messages', path: '/dashboard/messages', icon: <MessageIcon /> },
  { name: 'Environmental Impact', path: '/dashboard/impact', icon: <EcoIcon /> },
  { name: 'Settings', path: '/dashboard/settings', icon: <SettingsIcon /> }
];

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State for user menu
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // State for mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Handle user menu open
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  // Handle user menu close
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };
  
  // Toggle drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    
    setDrawerOpen(open);
  };
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <EcoIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            EcoSwap
          </Typography>
          
          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            {/* Mobile drawer */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <EcoIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    EcoSwap
                  </Typography>
                </Box>
                <Divider />
                
                <List>
                  {publicNavItems.map((item) => (
                    <ListItem
                      button
                      key={item.name}
                      component={RouterLink}
                      to={item.path}
                    >
                      <ListItemIcon>
                        {item.name === 'Home' ? <EcoIcon /> : 
                         item.name === 'Browse Items' ? <SearchIcon /> : 
                         <InfoIcon />}
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  ))}
                </List>
                
                {isAuthenticated && (
                  <>
                    <Divider />
                    <List>
                      {userNavItems.map((item) => (
                        <ListItem
                          button
                          key={item.name}
                          component={RouterLink}
                          to={item.path}
                        >
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          <ListItemText primary={item.name} />
                        </ListItem>
                      ))}
                      <ListItem button onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </List>
                  </>
                )}
                
                {!isAuthenticated && (
                  <>
                    <Divider />
                    <List>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/login"
                      >
                        <ListItemIcon>
                          <LoginIcon />
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/register"
                      >
                        <ListItemIcon>
                          <RegisterIcon />
                        </ListItemIcon>
                        <ListItemText primary="Register" />
                      </ListItem>
                    </List>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
          
          {/* Logo for mobile */}
          <EcoIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            EcoSwap
          </Typography>
          
          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {publicNavItems.map((item) => (
              <Button
                key={item.name}
                component={RouterLink}
                to={item.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          
          {/* User section */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Notifications">
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                      <Badge badgeContent={0} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={user?.firstName}
                        src={user?.profilePicture}
                        sx={{ bgcolor: 'secondary.main' }}
                      >
                        {user?.firstName?.charAt(0)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userNavItems.map((item) => (
                    <MenuItem
                      key={item.name}
                      onClick={() => {
                        handleCloseUserMenu();
                        navigate(item.path);
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 1 }}>{item.icon}</Box>
                        <Typography textAlign="center">{item.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 1 }}><LogoutIcon /></Box>
                      <Typography textAlign="center">Logout</Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;