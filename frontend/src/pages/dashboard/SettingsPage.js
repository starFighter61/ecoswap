import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
  PhotoCamera as CameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock user data
const mockUser = {
  id: 101,
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '(555) 123-4567',
  location: 'Portland, OR',
  bio: 'Passionate about sustainability and reducing waste. I love finding new homes for items I no longer need and discovering unique pre-loved treasures from others.',
  avatar: 'https://via.placeholder.com/150?text=SJ',
  joinDate: '2022-05-10T00:00:00Z',
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    messageNotifications: true,
    swapNotifications: true,
    locationRadius: 10,
    darkMode: false
  }
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    messageNotifications: true,
    swapNotifications: true,
    locationRadius: 10,
    darkMode: false
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({});

  // Fetch user data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setUser(mockUser);
      setFormData({
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone || '',
        location: mockUser.location,
        bio: mockUser.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPreferences(mockUser.preferences);
      setLoading(false);
    }, 500);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, checked, value } = e.target;
    
    if (name === 'locationRadius') {
      setPreferences({
        ...preferences,
        [name]: Number(value)
      });
    } else {
      setPreferences({
        ...preferences,
        [name]: checked
      });
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleProfileUpdate = () => {
    // Validate form
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, this would be an API call
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio
    });
    
    setNotification({
      open: true,
      message: 'Profile updated successfully',
      severity: 'success'
    });
  };

  const handlePasswordUpdate = () => {
    // Validate form
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, this would be an API call
    setNotification({
      open: true,
      message: 'Password updated successfully',
      severity: 'success'
    });
    
    // Clear password fields
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePreferencesUpdate = () => {
    // In a real app, this would be an API call
    setUser({
      ...user,
      preferences
    });
    
    setNotification({
      open: true,
      message: 'Preferences updated successfully',
      severity: 'success'
    });
  };

  const handleDeleteAccount = () => {
    setDialogOpen(false);
    
    // In a real app, this would be an API call
    setNotification({
      open: true,
      message: 'Account deleted successfully',
      severity: 'info'
    });
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      logout();
      navigate('/');
    }, 2000);
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
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
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>
      
      <Grid container spacing={4}>
        {/* Left column - Avatar and menu */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{ width: 120, height: 120, mx: 'auto' }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' }
                }}
                aria-label="change profile picture"
              >
                <CameraIcon />
              </IconButton>
            </Box>
            <Typography variant="h6" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Member since {new Date(user.joinDate).toLocaleDateString()}
            </Typography>
          </Paper>
          
          <Paper>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<SecurityIcon />} label="Security" />
              <Tab icon={<NotificationsIcon />} label="Preferences" />
              <Tab icon={<DeleteIcon />} label="Delete Account" />
            </Tabs>
          </Paper>
        </Grid>
        
        {/* Right column - Settings content */}
        <Grid item xs={12} md={9}>
          {/* Profile tab */}
          {tabValue === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your personal information and how it appears on your profile.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={!!errors.location}
                    helperText={errors.location}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    placeholder="Tell others about yourself and what you're interested in swapping..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleProfileUpdate}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
          
          {/* Security tab */}
          {tabValue === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Password & Security
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your password to keep your account secure.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={showPassword.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('current')}
                            edge="end"
                          >
                            {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showPassword.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword || 'Password must be at least 8 characters'}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('new')}
                            edge="end"
                          >
                            {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility('confirm')}
                            edge="end"
                          >
                            {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handlePasswordUpdate}
                    >
                      Update Password
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
          
          {/* Preferences tab */}
          {tabValue === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notifications & Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Customize your notification settings and app preferences.
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive updates and notifications via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="emailNotifications"
                      checked={preferences.emailNotifications}
                      onChange={handlePreferenceChange}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive notifications on your device"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="pushNotifications"
                      checked={preferences.pushNotifications}
                      onChange={handlePreferenceChange}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Message Notifications" 
                    secondary="Get notified when you receive new messages"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="messageNotifications"
                      checked={preferences.messageNotifications}
                      onChange={handlePreferenceChange}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Swap Notifications" 
                    secondary="Get notified about swap requests and updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      name="swapNotifications"
                      checked={preferences.swapNotifications}
                      onChange={handlePreferenceChange}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
                
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location Radius" 
                    secondary={`Show items within ${preferences.locationRadius} km of your location`}
                  />
                  <ListItemSecondaryAction sx={{ width: '50%' }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs>
                        <TextField
                          type="number"
                          name="locationRadius"
                          value={preferences.locationRadius}
                          onChange={handlePreferenceChange}
                          inputProps={{
                            min: 1,
                            max: 100,
                            step: 1
                          }}
                          size="small"
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">km</Typography>
                      </Grid>
                    </Grid>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handlePreferencesUpdate}
                >
                  Save Preferences
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Delete account tab */}
          {tabValue === 3 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Delete Account
              </Typography>
              <Typography variant="body2" paragraph>
                Permanently delete your account and all associated data. This action cannot be undone.
              </Typography>
              
              <Box sx={{ bgcolor: 'error.lightest', p: 2, borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" color="error">
                  Warning: Deleting your account will remove all your items, swaps, messages, and personal information. This action is permanent and cannot be reversed.
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDialogOpen(true)}
              >
                Delete My Account
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Delete account confirmation dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Delete Your Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including items, swaps, and messages.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;