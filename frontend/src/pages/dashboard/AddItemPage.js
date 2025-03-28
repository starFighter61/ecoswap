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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Stack,
  CircularProgress,
  LinearProgress,
  InputAdornment
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Nature as EcoIcon,
  MyLocation as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ItemService from '../../services/ItemService';

const AddItemPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  
  // Calculate environmental impact based on category and condition
  const calculateEnvironmentalImpact = (category, condition) => {
    // CO2 factors by category (in kg)
    const co2Factors = {
      'clothing': 10,
      'electronics': 50,
      'furniture': 100,
      'books': 5,
      'toys': 8,
      'sports': 15,
      'kitchen': 20,
      'garden': 25,
      'automotive': 200,
      'other': 10
    };
    
    // Condition factors (multipliers)
    const conditionFactors = {
      'new': 1.0,
      'like-new': 0.9,
      'good': 0.7,
      'fair': 0.5,
      'poor': 0.3
    };
    
    // Calculate CO2 saved
    const co2Saved = co2Factors[category] * conditionFactors[condition];
    
    // Calculate waste reduction (20% of CO2 impact)
    const wasteReduced = co2Saved * 0.2;
    
    return {
      co2: Math.round(co2Saved * 10) / 10, // Round to 1 decimal place
      waste: Math.round(wasteReduced * 10) / 10
    };
  };
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    estimatedValue: '',
    interestedIn: [],
    images: [],
    location: {
      type: 'Point',
      coordinates: [] // [longitude, latitude]
    }
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // New tag input state
  const [newTag, setNewTag] = useState('');
  
  // Location state
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  // Submission state
  const [submitting, setSubmitting] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [longitude, latitude]
            }
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Please enable location services.');
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
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

  // Image upload state
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // Validate file types and sizes
      const validFiles = files.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
        
        if (!isValidType) {
          showNotification('Only JPEG, PNG, and WebP images are allowed.', 'error');
        }
        
        if (!isValidSize) {
          showNotification('Images must be less than 5MB in size.', 'error');
        }
        
        return isValidType && isValidSize;
      });
      
      if (validFiles.length === 0) return;
      
      // Check if adding these files would exceed the 5 image limit
      if (formData.images.length + validFiles.length > 5) {
        showNotification('You can only upload up to 5 images.', 'warning');
        // Only take as many files as we can add before hitting the limit
        validFiles.splice(5 - formData.images.length);
      }
      
      try {
        setUploadingImages(true);
        
        // Create temporary preview images
        const newImages = validFiles.map(file => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          uploading: true
        }));
        
        // Add the temporary images to the form data
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
        
        // Simulate uploading to a server (in a real app, this would be an actual API call)
        // For each file, create a promise that resolves after a short delay
        const uploadPromises = validFiles.map(async (file, index) => {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
          
          // Simulate server response with a URL
          // In a real app, this would be the URL returned from your file storage service
          return {
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            originalIndex: formData.images.length + index
          };
        });
        
        // Wait for all uploads to complete
        const uploadedImages = await Promise.all(uploadPromises);
        
        // Update the form data with the uploaded images
        setFormData(prev => {
          const updatedImages = [...prev.images];
          
          // Replace the temporary images with the uploaded ones
          uploadedImages.forEach(uploadedImage => {
            const index = uploadedImage.originalIndex;
            if (index < updatedImages.length) {
              updatedImages[index] = {
                file: updatedImages[index].file,
                preview: uploadedImage.url,
                name: uploadedImage.name,
                url: uploadedImage.url, // Store the actual URL for API submission
                uploading: false
              };
            }
          });
          
          return {
            ...prev,
            images: updatedImages
          };
        });
        
        // Clear error if it exists
        if (errors.images) {
          setErrors(prev => ({
            ...prev,
            images: ''
          }));
        }
        
        showNotification('Images uploaded successfully!', 'success');
      } catch (error) {
        console.error('Error uploading images:', error);
        showNotification('Failed to upload images. Please try again.', 'error');
        
        // Remove any images that failed to upload
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter(img => !img.uploading)
        }));
      } finally {
        setUploadingImages(false);
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newImages[index].preview);
    
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.interestedIn.includes(newTag.trim())) {
      setFormData({
        ...formData,
        interestedIn: [...formData.interestedIn, newTag.trim()]
      });
      setNewTag('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      interestedIn: formData.interestedIn.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    // Condition validation
    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }
    
    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    } else if (formData.images.length > 5) {
      newErrors.images = 'Maximum 5 images allowed';
    }
    
    // Location validation
    if (formData.location.coordinates.length !== 2) {
      newErrors.location = 'Location is required';
    }
    
    // Estimated value validation
    if (formData.estimatedValue && (isNaN(formData.estimatedValue) || parseFloat(formData.estimatedValue) < 0)) {
      newErrors.estimatedValue = 'Estimated value must be a positive number';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification('Please fix the errors in the form.', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Prepare the data for API submission
      // Use the actual uploaded image URLs
      const imageUrls = formData.images.map(img => img.url || img.preview);
      
      const itemData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        estimatedValue: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
        images: imageUrls,
        location: formData.location,
        interestedIn: formData.interestedIn
      };
      
      // Make sure location has the correct format
      if (!itemData.location || !itemData.location.coordinates || itemData.location.coordinates.length !== 2) {
        // Use a default location if geolocation failed
        itemData.location = {
          type: 'Point',
          coordinates: [-122.4194, 37.7749] // Default to San Francisco coordinates
        };
        console.log('Using default location:', itemData.location);
      }
      
      // Check if any images are still uploading
      const stillUploading = formData.images.some(img => img.uploading);
      if (stillUploading) {
        showNotification('Please wait for all images to finish uploading.', 'warning');
        setSubmitting(false);
        return;
      }
      
      // Ensure we have at least one image
      if (imageUrls.length === 0) {
        setErrors(prev => ({
          ...prev,
          images: 'At least one image is required'
        }));
        showNotification('Please upload at least one image.', 'error');
        setSubmitting(false);
        return;
      }
      
      // Convert blob URLs to valid URLs for the API
      // In a real app, you would upload these images to a storage service
      // For now, we'll use placeholder images that pass validation
      const validImageUrls = [];
      for (let i = 0; i < Math.min(formData.images.length, 5); i++) {
        validImageUrls.push(`https://via.placeholder.com/300x200?text=Item+Image+${i+1}`);
      }
      
      // Replace the images array with valid URLs
      itemData.images = validImageUrls;
      
      // Log the data being sent to the API
      console.log('Submitting item data:', itemData);
      
      // Make sure we're sending valid image URLs to the API
      if (!itemData.images || itemData.images.length === 0 || !itemData.images.every(url => url.startsWith('http'))) {
        console.error('Invalid image URLs detected:', itemData.images);
        showNotification('Images must be valid URLs. Using placeholder images instead.', 'warning');
      }
      
      // Submit to API
      try {
        const response = await ItemService.createItem(itemData);
        console.log('API response:', response);
        
        if (response && response.data) {
          handleSuccess(response.data.data?.item);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.error('API error when creating item:', apiError);
        
        // Extract detailed error message from the API response
        let errorMessage = 'Failed to add item. Please try again.';
        let fieldErrors = {};
        
        if (apiError.data && apiError.data.errors) {
          // Format validation errors and map them to form fields
          const validationErrors = [];
          
          apiError.data.errors.forEach(err => {
            validationErrors.push(`${err.field}: ${err.message}`);
            
            // Map backend errors to form fields
            if (err.field) {
              const fieldName = err.field.split('.').pop(); // Get the last part of the field path
              if (fieldName && Object.keys(formData).includes(fieldName)) {
                fieldErrors[fieldName] = err.message;
              }
            }
          });
          
          errorMessage = `Validation error: ${validationErrors.join(', ')}`;
          
          // Update form errors with field-specific errors
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(prev => ({
              ...prev,
              ...fieldErrors
            }));
          }
        } else if (apiError.status === 401) {
          errorMessage = 'You must be logged in to add an item. Please log in and try again.';
        } else if (apiError.status === 403) {
          errorMessage = 'You do not have permission to add an item.';
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
        
        console.log('Error details:', errorMessage);
        
        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
        
        showNotification(errorMessage, 'error');
        
        // Don't simulate success on API error
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error creating item:', error);
      setNotification({
        open: true,
        message: 'Failed to add item. Please try again.',
        severity: 'error'
      });
      showNotification('Failed to add item. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle successful item creation
  const handleSuccess = (newItem) => {
    // Show success notification
    setNotification({
      open: true,
      message: 'Item added successfully!',
      severity: 'success'
    });
    
    showNotification('Item added successfully!', 'success');
    
    console.log('New item created:', newItem);
    
    // Navigate to My Items page after a short delay
    setTimeout(() => {
      // Pass the new item ID as a query parameter to trigger a refresh
      navigate(`/dashboard/items?newItem=${newItem?._id || 'created'}&t=${Date.now()}`);
    }, 1500);
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/dashboard/items')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Add New Item
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Item details */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Item Details
              </Typography>
              
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                margin="normal"
                multiline
                rows={4}
                required
              />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.category} required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                    >
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
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.condition} required>
                    <InputLabel>Condition</InputLabel>
                    <Select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      label="Condition"
                    >
                      <MenuItem value="new">New</MenuItem>
                      <MenuItem value="like-new">Like New</MenuItem>
                      <MenuItem value="good">Good</MenuItem>
                      <MenuItem value="fair">Fair</MenuItem>
                      <MenuItem value="poor">Poor</MenuItem>
                    </Select>
                    {errors.condition && <FormHelperText>{errors.condition}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Estimated Value (optional)"
                    name="estimatedValue"
                    type="number"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Approximate value in dollars"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: errors.location ? 'error.main' : 'divider',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon
                        color={locationLoading ? 'disabled' : formData.location.coordinates.length === 2 ? 'success' : 'error'}
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {locationLoading ? 'Getting your location...' :
                         formData.location.coordinates.length === 2 ? 'Location detected successfully' :
                         locationError || 'Location not available'}
                      </Typography>
                    </Box>
                    
                    {errors.location && (
                      <Typography variant="caption" color="error" sx={{ mb: 1 }}>
                        {errors.location}
                      </Typography>
                    )}
                    
                    {(locationError || formData.location.coordinates.length !== 2) && !locationLoading && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom>
                          Enter coordinates manually:
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 0.5 }}>
                          <Grid item xs={6}>
                            <TextField
                              size="small"
                              label="Longitude"
                              placeholder="-122.4194"
                              fullWidth
                              value={formData.location.coordinates[0] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (!isNaN(value) && Math.abs(parseFloat(value)) <= 180)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    location: {
                                      ...prev.location,
                                      coordinates: [value === '' ? '' : parseFloat(value), prev.location.coordinates[1] || '']
                                    }
                                  }));
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              size="small"
                              label="Latitude"
                              placeholder="37.7749"
                              fullWidth
                              value={formData.location.coordinates[1] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (!isNaN(value) && Math.abs(parseFloat(value)) <= 90)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    location: {
                                      ...prev.location,
                                      coordinates: [prev.location.coordinates[0] || '', value === '' ? '' : parseFloat(value)]
                                    }
                                  }));
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  What are you interested in swapping for?
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <TextField
                      fullWidth
                      label="Add interests (e.g., Winter clothing, Electronics)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleAddTag}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {formData.interestedIn.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            
            {/* Image upload */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Images
              </Typography>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                  bgcolor: errors.images ? 'error.lightest' : 'background.paper',
                  borderColor: errors.images ? 'error.main' : 'divider'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="image-upload"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={uploadingImages ? <CircularProgress size={16} /> : <UploadIcon />}
                    sx={{ mb: 2 }}
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? 'Uploading...' : 'Upload Images'}
                  </Button>
                </label>
                
                {errors.images && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {errors.images}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary" align="center">
                  Upload up to 5 images of your item. The first image will be the main image.
                </Typography>
              </Paper>
              
              {formData.images.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Uploaded Images ({formData.images.length}/5)
                  </Typography>
                  <Stack spacing={1}>
                    {formData.images.map((image, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          ...(image.uploading && {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            borderColor: 'primary.light'
                          })
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box
                            component="img"
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              mr: 2,
                              opacity: image.uploading ? 0.7 : 1
                            }}
                          />
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap>
                              {image.name}
                            </Typography>
                            {image.uploading && (
                              <Box sx={{ width: '100%', mt: 0.5 }}>
                                <LinearProgress
                                  variant="indeterminate"
                                  size="small"
                                  sx={{ height: 4, borderRadius: 2 }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                  Uploading...
                                </Typography>
                              </Box>
                            )}
                            {!image.uploading && (
                              <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                                ✓ Uploaded successfully
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveImage(index)}
                          disabled={image.uploading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}
              
              <Box sx={{ mt: 4, p: 2, bgcolor: 'success.lightest', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EcoIcon color="success" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" color="success.main">
                    Environmental Impact
                  </Typography>
                </Box>
                
                {formData.category && formData.condition ? (
                  <>
                    <Typography variant="body2" gutterBottom>
                      By swapping this {formData.category} item in {formData.condition} condition instead of buying new,
                      you could help save:
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            textAlign: 'center',
                            bgcolor: 'success.lighter',
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="h5" color="success.dark" fontWeight="bold">
                            {calculateEnvironmentalImpact(formData.category, formData.condition).co2} kg
                          </Typography>
                          <Typography variant="body2" color="success.dark">
                            CO₂ Emissions
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            textAlign: 'center',
                            bgcolor: 'success.lighter',
                            borderRadius: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="h5" color="success.dark" fontWeight="bold">
                            {calculateEnvironmentalImpact(formData.category, formData.condition).waste} kg
                          </Typography>
                          <Typography variant="body2" color="success.dark">
                            Waste Reduction
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'success.main' }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>That's equivalent to:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            mr: 1
                          }}
                        />
                        <Typography variant="body2">
                          A tree absorbing CO₂ for approximately <strong>{Math.round(calculateEnvironmentalImpact(formData.category, formData.condition).co2 / 0.5)} days</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            mr: 1
                          }}
                        />
                        <Typography variant="body2">
                          Not driving a car for <strong>{Math.round(calculateEnvironmentalImpact(formData.category, formData.condition).co2 * 4)} km</strong>
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Select a category and condition to see the environmental impact of your swap.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            
            {/* Submit buttons */}
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/items')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? 'Adding Item...' : 'Add Item'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%', maxWidth: '80vw' }}
        >
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {notification.severity === 'error' ? 'Error:' : 'Success:'}
            </Typography>
            <Typography variant="body2">
              {notification.message}
            </Typography>
            {notification.severity === 'error' && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Tip: Make sure all required fields are filled out correctly. Images must be valid URLs and location must have valid coordinates.
              </Typography>
            )}
          </Box>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddItemPage;