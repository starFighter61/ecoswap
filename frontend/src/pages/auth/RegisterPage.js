import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  PersonAddOutlined as PersonAddOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

// Step labels
const steps = ['Account Information', 'Personal Details', 'Location'];

const RegisterPage = () => {
  const { register, error, loading, setError } = useAuth();
  const { setNotification } = useNotification();
  const navigate = useNavigate();
  
  // Active step state
  const [activeStep, setActiveStep] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    bio: '',
    agreeTerms: false,
    location: {
      type: 'Point',
      coordinates: [0, 0], // [longitude, latitude]
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    }
  });
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeTerms: '',
    location: ''
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Clear error when user starts typing
    setFormErrors({
      ...formErrors,
      [name]: ''
    });
    
    // Clear global error
    if (error) {
      setError(null);
    }
    
    // Handle nested location fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: {
            ...formData.location.address,
            [addressField]: value
          }
        }
      });
    } else {
      // Update form data
      setFormData({
        ...formData,
        [name]: name === 'agreeTerms' ? checked : value
      });
    }
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle confirm password visibility
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: [longitude, latitude]
            }
          });
          
          // Clear location error
          setFormErrors({
            ...formErrors,
            location: ''
          });
          
          setNotification({
            type: 'success',
            message: 'Location detected successfully!'
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setNotification({
            type: 'error',
            message: 'Could not get your location. Please enter it manually.'
          });
        }
      );
    } else {
      setNotification({
        type: 'error',
        message: 'Geolocation is not supported by your browser.'
      });
    }
  };
  
  // Validate current step
  const validateStep = () => {
    let valid = true;
    const newErrors = { ...formErrors };
    
    if (activeStep === 0) {
      // Email validation
      if (!formData.email) {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        valid = false;
      }
      
      // Username validation
      if (!formData.username) {
        newErrors.username = 'Username is required';
        valid = false;
      } else if (formData.username.length < 3 || formData.username.length > 20) {
        newErrors.username = 'Username must be between 3 and 20 characters';
        valid = false;
      }
      
      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
        valid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        valid = false;
      }
      
      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
        valid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    } else if (activeStep === 1) {
      // First name validation
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
        valid = false;
      }
      
      // Last name validation
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
        valid = false;
      }
      
      // Terms agreement validation
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
        valid = false;
      }
    } else if (activeStep === 2) {
      // Location validation
      if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
        newErrors.location = 'Please provide your location';
        valid = false;
      }
      
      // Address validation
      if (!formData.location.address.city || !formData.location.address.country) {
        newErrors.location = 'City and country are required';
        valid = false;
      }
    }
    
    setFormErrors(newErrors);
    return valid;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate final step
    if (!validateStep()) {
      return;
    }
    
    // Register user
    const result = await register(formData);
    
    if (result.success) {
      setNotification({
        type: 'success',
        message: 'Registration successful! Welcome to EcoSwap.'
      });
      navigate('/dashboard');
    }
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
              disabled={loading}
            />
            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="Bio (Optional)"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              placeholder="Tell us a bit about yourself..."
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  color="primary"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={loading}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link component={RouterLink} to="/terms">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link component={RouterLink} to="/privacy">
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
            {formErrors.agreeTerms && (
              <Typography variant="caption" color="error">
                {formErrors.agreeTerms}
              </Typography>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                We need your location to show you nearby items for swapping.
              </Typography>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<LocationOnIcon />}
              onClick={getCurrentLocation}
              fullWidth
              sx={{ mb: 2 }}
              disabled={loading}
            >
              Use My Current Location
            </Button>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="street"
                  label="Street Address (Optional)"
                  name="address.street"
                  value={formData.location.address.street}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="address.city"
                  value={formData.location.address.city}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="state"
                  label="State/Province"
                  name="address.state"
                  value={formData.location.address.state}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="zipCode"
                  label="Zip/Postal Code"
                  name="address.zipCode"
                  value={formData.location.address.zipCode}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  label="Country"
                  name="address.country"
                  value={formData.location.address.country}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            
            {formErrors.location && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {formErrors.location}
              </Typography>
            )}
            
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Your location information is only used to show you nearby items and will never be shared publicly with exact coordinates.
              </Typography>
            </Box>
          </>
        );
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Your EcoSwap Account
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" noValidate sx={{ mt: 3, width: '100%' }}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" variant="body2">
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;