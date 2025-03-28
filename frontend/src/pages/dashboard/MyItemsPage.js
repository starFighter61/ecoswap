import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ItemService from '../../services/ItemService';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  Skeleton,
  Pagination,
  Stack,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Nature as EcoIcon,
  Refresh as RefreshIcon,
  Sort as SortIcon
} from '@mui/icons-material';

// Mock data for user's items
const mockItems = [
  {
    id: 1,
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket in excellent condition. Size M.',
    category: 'clothing',
    condition: 'lightly-used',
    location: 'Portland, OR',
    image: 'https://via.placeholder.com/300x200?text=Leather+Jacket',
    status: 'active',
    dateAdded: `${new Date().getFullYear()}-03-15T08:00:00Z`,
    views: 45,
    swapRequests: 2
  },
  {
    id: 10,
    title: 'Ceramic Plant Pots (Set of 3)',
    description: 'Beautiful ceramic pots in various sizes. Perfect for indoor plants.',
    category: 'home',
    condition: 'new',
    location: 'Portland, OR',
    image: 'https://via.placeholder.com/300x200?text=Plant+Pots',
    status: 'active',
    dateAdded: `${new Date().getFullYear()}-03-10T10:30:00Z`,
    views: 28,
    swapRequests: 1
  },
  {
    id: 11,
    title: 'Yoga Mat',
    description: 'High-quality yoga mat, 6mm thick. Used only a few times.',
    category: 'sports',
    condition: 'lightly-used',
    location: 'Portland, OR',
    image: 'https://via.placeholder.com/300x200?text=Yoga+Mat',
    status: 'inactive',
    dateAdded: `${new Date().getFullYear()}-03-05T14:45:00Z`,
    views: 12,
    swapRequests: 0
  },
  {
    id: 12,
    title: 'Coffee Table Books (Set of 5)',
    description: 'Collection of coffee table books on architecture and design.',
    category: 'books',
    condition: 'lightly-used',
    location: 'Portland, OR',
    image: 'https://via.placeholder.com/300x200?text=Coffee+Table+Books',
    status: 'active',
    dateAdded: `${new Date().getFullYear()}-02-18T09:20:00Z`,
    views: 19,
    swapRequests: 0
  },
  {
    id: 13,
    title: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with great sound quality. Battery life: 8 hours.',
    category: 'electronics',
    condition: 'used',
    location: 'Portland, OR',
    image: 'https://via.placeholder.com/300x200?text=Bluetooth+Speaker',
    status: 'active',
    dateAdded: `${new Date().getFullYear()}-02-05T16:10:00Z`,
    views: 37,
    swapRequests: 3
  }
];

// Item card component
const ItemCard = ({ item, onEdit, onDelete, onToggleStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    handleClose();
    onEdit(item);
  };
  
  const handleDelete = () => {
    handleClose();
    onDelete(item);
  };
  
  const handleToggleStatus = () => {
    handleClose();
    onToggleStatus(item);
  };
  
  const formatDate = (dateString) => {
    // Always use current year regardless of the date string
    const date = new Date(dateString);
    date.setFullYear(new Date().getFullYear());
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {item.status === 'inactive' && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1
          }}
        >
          <Chip 
            label="Inactive" 
            color="default" 
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)' }}
          />
        </Box>
      )}
      
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={item.image}
          alt={item.title}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            borderRadius: '50%'
          }}
        >
          <IconButton
            aria-label="more"
            aria-controls={open ? 'item-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="item-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'item-button',
            }}
          >
            <MenuItem component={RouterLink} to={`/items/${item.id}`}>
              <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
              View Item
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit Item
            </MenuItem>
            <MenuItem onClick={handleToggleStatus}>
              {item.status === 'active' ? (
                <>
                  <VisibilityOffIcon fontSize="small" sx={{ mr: 1 }} />
                  Deactivate
                </>
              ) : (
                <>
                  <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                  Activate
                </>
              )}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete Item
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
        <Typography variant="body2" color="text.secondary">
          Added: {formatDate(item.dateAdded)}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Views">
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <VisibilityIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {item.views}
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Swap Requests">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EcoIcon fontSize="small" sx={{ mr: 0.5, color: item.swapRequests > 0 ? 'success.main' : 'text.secondary' }} />
              <Typography 
                variant="body2" 
                color={item.swapRequests > 0 ? 'success.main' : 'text.secondary'}
                fontWeight={item.swapRequests > 0 ? 'bold' : 'normal'}
              >
                {item.swapRequests}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/dashboard/items/edit/${item.id}`}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

// Skeleton loader for item cards
const ItemCardSkeleton = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={160} />
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" height={32} width="80%" />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2 }}>
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 4 }} />
      </Box>
      <Skeleton variant="text" height={20} width="60%" />
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={20} height={20} />
        <Skeleton variant="circular" width={20} height={20} sx={{ ml: 2, mr: 1 }} />
        <Skeleton variant="text" width={20} height={20} />
      </Box>
      <Skeleton variant="rectangular" width={70} height={30} sx={{ borderRadius: 1 }} />
    </CardActions>
  </Card>
);

// Item statistics component
const ItemStatistics = ({ items }) => {
  const totalItems = items.length;
  const activeItems = items.filter(item => item.status === 'active').length;
  const inactiveItems = items.filter(item => item.status === 'inactive').length;
  const totalSwapRequests = items.reduce((total, item) => total + (item.swapRequests || 0), 0);
  const totalViews = items.reduce((total, item) => total + (item.views || 0), 0);

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Item Statistics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={4} md={2.4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">{totalItems}</Typography>
            <Typography variant="body2" color="text.secondary">Total Items</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">{activeItems}</Typography>
            <Typography variant="body2" color="text.secondary">Active Items</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="text.secondary">{inactiveItems}</Typography>
            <Typography variant="body2" color="text.secondary">Inactive Items</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={2.4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="secondary.main">{totalSwapRequests}</Typography>
            <Typography variant="body2" color="text.secondary">Swap Requests</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">{totalViews}</Typography>
            <Typography variant="body2" color="text.secondary">Total Views</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const MyItemsPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);

  // Get user from AuthContext
  const { user } = useAuth();
  const location = useLocation();

  // Fetch items on component mount, when refreshing, or when query params change
  useEffect(() => {
    fetchItems();
    
    // Check if we have a newItem query parameter, which indicates we should refresh
    const params = new URLSearchParams(location.search);
    const newItem = params.get('newItem');
    
    if (newItem) {
      console.log('New item detected in URL, refreshing items list:', newItem);
      setNotification({
        open: true,
        message: 'New item added! Refreshing your items list...',
        severity: 'success'
      });
    }
  }, [user?._id, location.search]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Fetch items from the API using ItemService with a specific filter to include all items
      // regardless of availability status and owned by the current user
      const response = await ItemService.getItems({
        owner: user?._id,
        includeUnavailable: true // Custom parameter to override the default isAvailable filter
      });
      
      console.log('API Response:', response); // Debug log
      
      if (response && response.data && response.data.items && response.data.items.length > 0) {
        // Use the items from the API response
        setItems(response.data.items);
        setFilteredItems(response.data.items);
        
        // Show success notification when items are loaded
        setNotification({
          open: true,
          message: `${response.data.items.length} items loaded successfully`,
          severity: 'success'
        });
      } else {
        // If no items found, use mock data as fallback
        console.warn('No items found for current user, using mock data');
        setItems(mockItems);
        setFilteredItems(mockItems);
        
        // Show info notification
        setNotification({
          open: true,
          message: 'Using sample items. Add real items to see them here.',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      // Use mock data as fallback
      setItems(mockItems);
      setFilteredItems(mockItems);
      
      // Show error notification
      setNotification({
        open: true,
        message: 'Failed to load items. Using sample data instead.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchItems();
  };

  // Filter and sort items when search term, filters, or sort options change
  useEffect(() => {
    if (items.length > 0) {
      // First filter the items
      let filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
      });
      
      // Then sort the filtered items
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'dateAdded':
            comparison = new Date(a.dateAdded) - new Date(b.dateAdded);
            break;
          case 'views':
            comparison = a.views - b.views;
            break;
          case 'swapRequests':
            comparison = a.swapRequests - b.swapRequests;
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });
      
      setFilteredItems(filtered);
      // Reset to first page when filters change
      setPage(1);
    }
  }, [items, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const handleEditItem = (item) => {
    // Navigate to edit page
    console.log('Edit item:', item);
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = async () => {
    try {
      setLoading(true);
      
      // Check if we have a valid item to delete
      if (!itemToDelete) {
        throw new Error('No item selected for deletion');
      }
      
      // Get the item ID (handle both MongoDB _id and mock data id)
      const itemId = itemToDelete._id || itemToDelete.id;
      
      if (!itemId) {
        throw new Error('Invalid item ID');
      }
      
      console.log('Deleting item with ID:', itemId);
      
      // Call the API to delete the item
      await ItemService.deleteItem(itemId);
      
      // Update local state - handle both id and _id cases
      const updatedItems = items.filter(item => {
        const currentItemId = item._id || item.id;
        return currentItemId !== itemId;
      });
      
      setItems(updatedItems);
      
      setNotification({
        open: true,
        message: 'Item deleted successfully',
        severity: 'success'
      });
      
      // Refresh the items list after deletion
      setTimeout(() => {
        fetchItems();
      }, 500);
      
    } catch (error) {
      console.error('Error deleting item:', error);
      setNotification({
        open: true,
        message: 'Failed to delete item. Please try again.',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setLoading(false);
    }
  };

  const handleToggleItemStatus = async (item) => {
    try {
      const newStatus = item.status === 'active' ? 'inactive' : 'active';
      
      // Call the API to update the item status
      await ItemService.updateItem(item.id, { status: newStatus });
      
      // Update local state
      const updatedItems = items.map(i => {
        if (i.id === item.id) {
          return { ...i, status: newStatus };
        }
        return i;
      });
      
      setItems(updatedItems);
      
      setNotification({
        open: true,
        message: `Item ${item.status === 'active' ? 'deactivated' : 'activated'} successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating item status:', error);
      setNotification({
        open: true,
        message: 'Failed to update item status. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getUniqueCategories = () => {
    const categories = items.map(item => item.category);
    return ['', ...new Set(categories)];
  };

  const handleSortMenuOpen = (event) => {
    setSortMenuAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchorEl(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending order
      setSortBy(field);
      setSortOrder('desc');
    }
    handleSortMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Calculate pagination
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

  // Render skeleton loaders during initial loading
  if (loading && !refreshing) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Items
          </Typography>
          <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        
        <Skeleton variant="rectangular" height={120} sx={{ mb: 4, borderRadius: 1 }} />
        
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <ItemCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Items
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            color="primary"
            sx={{ height: 40 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Items'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/dashboard/items/add"
          >
            Add New Item
          </Button>
        </Box>
      </Box>
      
      {/* Notification for new users */}
      {items.length === 0 && (
        <Paper sx={{ p: 2, mb: 4, bgcolor: 'info.lightest', border: 1, borderColor: 'info.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RefreshIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="body1" color="info.dark">
              If you've just added an item and don't see it here, click the "Refresh Items" button above to update the list.
            </Typography>
          </Box>
        </Paper>
      )}
      
      {/* Item Statistics */}
      {items.length > 0 && <ItemStatistics items={items} />}
      
      {/* Filters and Sort */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
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
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {getUniqueCategories().filter(cat => cat !== '').map((category) => (
                  <MenuItem key={category} value={category} sx={{ textTransform: 'capitalize' }}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={handleSortMenuOpen}
              aria-controls="sort-menu"
              aria-haspopup="true"
            >
              Sort By
            </Button>
            <Menu
              id="sort-menu"
              anchorEl={sortMenuAnchorEl}
              open={Boolean(sortMenuAnchorEl)}
              onClose={handleSortMenuClose}
            >
              <MenuItem
                onClick={() => handleSort('dateAdded')}
                selected={sortBy === 'dateAdded'}
              >
                Date Added {sortBy === 'dateAdded' && (sortOrder === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem
                onClick={() => handleSort('title')}
                selected={sortBy === 'title'}
              >
                Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem
                onClick={() => handleSort('views')}
                selected={sortBy === 'views'}
              >
                Views {sortBy === 'views' && (sortOrder === 'asc' ? '↑' : '↓')}
              </MenuItem>
              <MenuItem
                onClick={() => handleSort('swapRequests')}
                selected={sortBy === 'swapRequests'}
              >
                Swap Requests {sortBy === 'swapRequests' && (sortOrder === 'asc' ? '↑' : '↓')}
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={6} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Tooltip title="Reset Filters">
              <IconButton
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('');
                  setSortBy('dateAdded');
                  setSortOrder('desc');
                }}
                color="primary"
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Items grid */}
      {filteredItems.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {currentItems.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <ItemCard
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onToggleStatus={handleToggleItemStatus}
                />
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChangePage}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No items found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {items.length > 0 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'You haven\'t added any items yet. Add your first item to start swapping!'}
          </Typography>
          {items.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/dashboard/items/add"
              sx={{ mt: 2 }}
            >
              Add Your First Item
            </Button>
          )}
        </Paper>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button
            onClick={confirmDeleteItem}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
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

export default MyItemsPage;