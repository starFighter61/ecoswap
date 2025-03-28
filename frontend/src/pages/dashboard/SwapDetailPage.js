import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Divider,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  Chat as ChatIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  Nature as EcoIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock swap data
const mockSwap = {
  id: 301,
  status: 'pending',
  date: '2023-02-18T14:20:00Z',
  direction: 'incoming',
  item: {
    id: 1,
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket in excellent condition. Size M.',
    category: 'clothing',
    condition: 'lightly-used',
    image: 'https://via.placeholder.com/600x400?text=Leather+Jacket'
  },
  otherItem: {
    id: 5,
    title: 'Plant Collection',
    description: 'Set of 5 small indoor plants. Perfect for beginners.',
    category: 'home',
    condition: 'new',
    image: 'https://via.placeholder.com/600x400?text=Plant+Collection'
  },
  user: {
    id: 102,
    name: 'Michael Chen',
    avatar: 'https://via.placeholder.com/150?text=MC',
    rating: 4.6,
    joinDate: '2022-06-15T00:00:00Z',
    completedSwaps: 12
  },
  messages: [
    {
      id: 1001,
      sender: 'other',
      text: 'Hi there! I\'m interested in swapping my plant collection for your leather jacket. Would you be interested?',
      timestamp: '2023-02-18T14:20:00Z',
      read: true
    },
    {
      id: 1002,
      sender: 'user',
      text: 'Hello! Thanks for your interest. Could you tell me more about the plants? What types are they?',
      timestamp: '2023-02-18T15:05:00Z',
      read: true
    },
    {
      id: 1003,
      sender: 'other',
      text: 'Sure! The collection includes a snake plant, pothos, spider plant, peace lily, and a small succulent. All are healthy and about 6 months old.',
      timestamp: '2023-02-18T15:30:00Z',
      read: true
    }
  ],
  environmentalImpact: {
    co2Saved: 8.5,
    wasteReduced: 2.3
  }
};

// Mock swap with meetup details
const mockAcceptedSwap = {
  ...mockSwap,
  status: 'accepted',
  meetupDate: '2023-02-25T15:00:00Z',
  meetupLocation: 'Central Park Coffee Shop, 123 Main St'
};

const SwapDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [swap, setSwap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [meetupDetails, setMeetupDetails] = useState({
    date: '',
    time: '',
    location: ''
  });
  const [declineReason, setDeclineReason] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch swap data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      // For demo purposes, show accepted swap if id is even
      const swapData = id % 2 === 0 ? mockAcceptedSwap : mockSwap;
      setSwap(swapData);
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" icon={<TimeIcon />} />;
      case 'accepted':
        return <Chip label="Accepted" color="info" icon={<CheckCircleIcon />} />;
      case 'completed':
        return <Chip label="Completed" color="success" icon={<CheckCircleIcon />} />;
      case 'declined':
        return <Chip label="Declined" color="error" icon={<CancelIcon />} />;
      case 'cancelled':
        return <Chip label="Cancelled" color="default" icon={<CancelIcon />} />;
      default:
        return <Chip label={status} />;
    }
  };

  const getActiveStep = (status) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 1;
      case 'completed':
        return 2;
      case 'declined':
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the API
      const message = {
        id: Date.now(),
        sender: 'user',
        text: newMessage,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setSwap({
        ...swap,
        messages: [...swap.messages, message]
      });
      
      setNewMessage('');
    }
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAcceptSwap = () => {
    // In a real app, this would send the acceptance to the API
    if (!meetupDetails.date || !meetupDetails.time || !meetupDetails.location) {
      return;
    }
    
    const meetupDate = new Date(`${meetupDetails.date}T${meetupDetails.time}`);
    
    setSwap({
      ...swap,
      status: 'accepted',
      meetupDate: meetupDate.toISOString(),
      meetupLocation: meetupDetails.location
    });
    
    setDialogOpen(false);
    
    setNotification({
      open: true,
      message: 'Swap accepted successfully!',
      severity: 'success'
    });
  };

  const handleDeclineSwap = () => {
    // In a real app, this would send the decline to the API
    if (!declineReason) {
      return;
    }
    
    setSwap({
      ...swap,
      status: 'declined',
      declinedReason: declineReason
    });
    
    setDialogOpen(false);
    
    setNotification({
      open: true,
      message: 'Swap declined',
      severity: 'info'
    });
  };

  const handleCompleteSwap = () => {
    // In a real app, this would send the completion to the API
    setSwap({
      ...swap,
      status: 'completed',
      completedDate: new Date().toISOString()
    });
    
    setDialogOpen(false);
    
    setNotification({
      open: true,
      message: 'Swap marked as completed!',
      severity: 'success'
    });
  };

  const handleCancelSwap = () => {
    // In a real app, this would send the cancellation to the API
    setSwap({
      ...swap,
      status: 'cancelled',
      cancelledReason: 'Changed my mind'
    });
    
    setDialogOpen(false);
    
    setNotification({
      open: true,
      message: 'Swap cancelled',
      severity: 'info'
    });
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

  if (!swap) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Swap not found</Typography>
        <Button 
          component={RouterLink} 
          to="/dashboard/swaps" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Back to Swaps
        </Button>
      </Container>
    );
  }

  const isIncomingRequest = swap.direction === 'incoming';
  const isPending = swap.status === 'pending';
  const isAccepted = swap.status === 'accepted';
  const isCompleted = swap.status === 'completed';
  const isDeclined = swap.status === 'declined';
  const isCancelled = swap.status === 'cancelled';
  const isActive = isPending || isAccepted;

  return (
    <Container sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/dashboard/swaps')}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Swap Details
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          {getStatusChip(swap.status)}
        </Box>
      </Box>
      
      {/* Stepper for active swaps */}
      {isActive && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={getActiveStep(swap.status)}>
            <Step>
              <StepLabel>Request Sent</StepLabel>
            </Step>
            <Step>
              <StepLabel>Swap Accepted</StepLabel>
            </Step>
            <Step>
              <StepLabel>Swap Completed</StepLabel>
            </Step>
          </Stepper>
        </Paper>
      )}
      
      {/* Declined or cancelled message */}
      {(isDeclined || isCancelled) && (
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          bgcolor: isDeclined ? 'error.lightest' : 'action.disabledBackground' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isDeclined ? (
              <CancelIcon color="error" sx={{ mr: 1 }} />
            ) : (
              <CancelIcon color="action" sx={{ mr: 1 }} />
            )}
            <Typography variant="h6" color={isDeclined ? 'error' : 'text.secondary'}>
              This swap was {isDeclined ? 'declined' : 'cancelled'}
            </Typography>
          </Box>
          {swap.declinedReason && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              Reason: {swap.declinedReason}
            </Typography>
          )}
          {swap.cancelledReason && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              Reason: {swap.cancelledReason}
            </Typography>
          )}
        </Paper>
      )}
      
      {/* Main content */}
      <Grid container spacing={4}>
        {/* Left column - Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Items to Swap
            </Typography>
            
            <Grid container spacing={3}>
              {/* Your item */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {isIncomingRequest ? 'Their Item' : 'Your Item'}
                </Typography>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={swap.item.image}
                    alt={swap.item.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {swap.item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {swap.item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={swap.item.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.light', 
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                      <Chip 
                        label={swap.item.condition} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'secondary.light', 
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Their item */}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {isIncomingRequest ? 'Your Item' : 'Their Item'}
                </Typography>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={swap.otherItem.image}
                    alt={swap.otherItem.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {swap.otherItem.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {swap.otherItem.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label={swap.otherItem.category} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'primary.light', 
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                      <Chip 
                        label={swap.otherItem.condition} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'secondary.light', 
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Environmental impact */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'success.lightest', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EcoIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" color="success.main">
                  Environmental Impact
                </Typography>
              </Box>
              <Typography variant="body2">
                By swapping these items instead of buying new, you're saving approximately {swap.environmentalImpact.co2Saved} kg of CO2 emissions and reducing waste by {swap.environmentalImpact.wasteReduced} kg.
              </Typography>
            </Box>
          </Paper>
          
          {/* Meetup details for accepted swaps */}
          {isAccepted && (
            <Paper sx={{ p: 3, mb: 4, bgcolor: 'info.lightest' }}>
              <Typography variant="h6" gutterBottom>
                Meetup Details
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Date and Time" 
                    secondary={formatDateTime(swap.meetupDate)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location" 
                    secondary={swap.meetupLocation}
                  />
                </ListItem>
              </List>
              
              {/* Action buttons for accepted swaps */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleOpenDialog('complete')}
                >
                  Mark as Completed
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Action buttons for pending swaps */}
          {isPending && isIncomingRequest && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Swap Request Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOpenDialog('decline')}
                  fullWidth
                >
                  Decline
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenDialog('accept')}
                  fullWidth
                >
                  Accept
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Cancel button for outgoing pending swaps */}
          {isPending && !isIncomingRequest && (
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Swap Request Actions
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleOpenDialog('cancel')}
                >
                  Cancel Request
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>
        
        {/* Right column - User info and messages */}
        <Grid item xs={12} md={4}>
          {/* User info */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {isIncomingRequest ? 'Requester' : 'Item Owner'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={swap.user.avatar}
                alt={swap.user.name}
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {swap.user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {swap.user.rating}/5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {swap.user.completedSwaps} successful swaps
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Member since {formatDate(swap.user.joinDate)}
            </Typography>
            
            <Button
              variant="outlined"
              component={RouterLink}
              to={`/users/${swap.user.id}`}
              fullWidth
              sx={{ mt: 2 }}
            >
              View Profile
            </Button>
          </Paper>
          
          {/* Messages */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Messages
            </Typography>
            
            <Box sx={{ 
              height: 300, 
              overflowY: 'auto', 
              mb: 2,
              p: 1,
              bgcolor: 'background.default',
              borderRadius: 1
            }}>
              {swap.messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.200',
                      color: message.sender === 'user' ? 'white' : 'text.primary'
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {isActive && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  size="small"
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Accept dialog */}
      <Dialog open={dialogOpen && dialogType === 'accept'} onClose={handleCloseDialog}>
        <DialogTitle>Accept Swap Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide details for the meetup to complete the swap.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={meetupDetails.date}
            onChange={(e) => setMeetupDetails({ ...meetupDetails, date: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={meetupDetails.time}
            onChange={(e) => setMeetupDetails({ ...meetupDetails, time: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            placeholder="e.g., Central Park Coffee Shop, 123 Main St"
            value={meetupDetails.location}
            onChange={(e) => setMeetupDetails({ ...meetupDetails, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAcceptSwap} 
            variant="contained"
            disabled={!meetupDetails.date || !meetupDetails.time || !meetupDetails.location}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Decline dialog */}
      <Dialog open={dialogOpen && dialogType === 'decline'} onClose={handleCloseDialog}>
        <DialogTitle>Decline Swap Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for declining this swap request.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleDeclineSwap} 
            color="error"
            disabled={!declineReason}
          >
            Decline
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Complete dialog */}
      <Dialog open={dialogOpen && dialogType === 'complete'} onClose={handleCloseDialog}>
        <DialogTitle>Complete Swap</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark this swap as completed? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCompleteSwap} 
            variant="contained"
            color="success"
          >
            Complete Swap
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Cancel dialog */}
      <Dialog open={dialogOpen && dialogType === 'cancel'} onClose={handleCloseDialog}>
        <DialogTitle>Cancel Swap Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this swap request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No, Keep Request</Button>
          <Button 
            onClick={handleCancelSwap} 
            color="error"
          >
            Yes, Cancel Request
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default SwapDetailPage;