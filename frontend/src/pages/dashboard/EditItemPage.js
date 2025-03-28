import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Nature as EcoIcon
} from '@mui/icons-material';

// Mock item data
const mockItem = {
  id: 1,
  title: 'Vintage Leather Jacket',
  description: 'Genuine leather jacket in excellent condition. Size M.',
  category: 'clothing',
  condition: 'lightly-used',
  location: 'Portland, OR',
  images: [
    {
      preview: 'https://via.placeholder.com/300x200?text=Leather+Jacket+1',
      name: 'jacket-front.jpg'
    },
    {
      preview: 'https://via.placeholder.com/300x200?text=Leather+Jacket+2',
      name: 'jacket-back.jpg'
    }
  ],
  interestedIn: ['Winter clothing', 'Electronics', 'Books'],
  status: 'active',
  dateAdded: '2023-02-15T08:00:00Z'
};

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    interestedIn: [],
    images: []
  });
  
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Form validation state
  const [errors, setErrors] = useState({});
  
  // New tag input state
  const [newTag, setNewTag] = useState('');
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch item data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setFormData({
        title: mockItem.title,
        description: mockItem.description,
        category: mockItem.category,
        condition: mockItem.condition,
        interestedIn: [...mockItem.interestedIn],
        images: [...mockItem.images]
      });
      setLoading(false);
    }, 500);
  }, [id]);

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

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      // In a real app, this would upload the files to a server
      // Here we're just creating local URLs for preview
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      }));
      
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages]
      });
      
      // Clear error if it exists
      if (errors.images) {
        setErrors({
          ...errors,
          images: ''
        });
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    
    // If it's a newly added image with an object URL, revoke it
    if (newImages[index].file) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    
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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, this would submit the form data to an API
    console.log('Form submitted:', formData);
    
    // Show success notification
    setNotification({
      open: true,
      message: 'Item updated successfully!',
      severity: 'success'
    });
    
    // Navigate to My Items page after a short delay
    setTimeout(() => {
      navigate('/dashboard/items');
    }, 2000);
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

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
            Edit Item
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
                      <MenuItem value="home">Home & Garden</MenuItem>
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
                      <MenuItem value="lightly-used">Lightly Used</MenuItem>
                      <MenuItem value="used">Used</MenuItem>
                    </Select>
                    {errors.condition && <FormHelperText>{errors.condition}</FormHelperText>}
                  </FormControl>
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
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Images
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
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              mr: 2
                            }}
                          />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {image.name}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}
              
              <Box sx={{ mt: 4, p: 2, bgcolor: 'success.lightest', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EcoIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" color="success.main">
                    Environmental Impact
                  </Typography>
                </Box>
                <Typography variant="body2">
                  By swapping this item instead of buying new, you could help save approximately 5-10 kg of CO2 emissions.
                </Typography>
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
                >
                  Save Changes
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
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditItemPage;