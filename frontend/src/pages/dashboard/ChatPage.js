import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Grid,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  SwapHoriz as SwapIcon,
  Info as InfoIcon,
  Image as ImageIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data for the chat
const mockChat = {
  id: 1001,
  user: {
    id: 102,
    name: 'Michael Chen',
    avatar: 'https://via.placeholder.com/150?text=MC',
    rating: 4.6
  },
  swap: {
    id: 301,
    status: 'pending',
    date: '2023-02-18T14:20:00Z',
    item: {
      id: 1,
      title: 'Vintage Leather Jacket',
      description: 'Genuine leather jacket in excellent condition. Size M.',
      image: 'https://via.placeholder.com/300x200?text=Leather+Jacket'
    },
    otherItem: {
      id: 5,
      title: 'Plant Collection',
      description: 'Set of 5 small indoor plants. Perfect for beginners.',
      image: 'https://via.placeholder.com/300x200?text=Plant+Collection'
    }
  },
  messages: [
    {
      id: 2001,
      sender: 'other',
      text: 'Hi there! I\'m interested in swapping my plant collection for your leather jacket. Would you be interested?',
      timestamp: '2023-02-18T14:20:00Z',
      isRead: true
    },
    {
      id: 2002,
      sender: 'user',
      text: 'Hello! Thanks for your interest. Could you tell me more about the plants? What types are they?',
      timestamp: '2023-02-18T15:05:00Z',
      isRead: true
    },
    {
      id: 2003,
      sender: 'other',
      text: 'Sure! The collection includes a snake plant, pothos, spider plant, peace lily, and a small succulent. All are healthy and about 6 months old.',
      timestamp: '2023-02-18T15:30:00Z',
      isRead: true
    },
    {
      id: 2004,
      sender: 'other',
      text: 'I can send you some pictures if you\'d like to see them.',
      timestamp: '2023-02-18T15:31:00Z',
      isRead: true
    }
  ]
};

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [showSwapDetails, setShowSwapDetails] = useState(false);

  // Fetch chat data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setChat(mockChat);
      setLoading(false);
    }, 500);
  }, [id]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && chat) {
      // In a real app, this would be an API call
      const message = {
        id: Date.now(),
        sender: 'user',
        text: newMessage,
        timestamp: new Date().toISOString(),
        isRead: true
      };
      
      setChat({
        ...chat,
        messages: [...chat.messages, message]
      });
      
      setNewMessage('');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" size="small" color="warning" />;
      case 'accepted':
        return <Chip label="Accepted" size="small" color="info" />;
      case 'completed':
        return <Chip label="Completed" size="small" color="success" />;
      case 'declined':
        return <Chip label="Declined" size="small" color="error" />;
      case 'cancelled':
        return <Chip label="Cancelled" size="small" color="default" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      formattedDate: formatDate(date),
      messages
    }));
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!chat) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Chat not found</Typography>
        <Button 
          component={RouterLink} 
          to="/dashboard/messages" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Back to Messages
        </Button>
      </Container>
    );
  }

  const messageGroups = groupMessagesByDate(chat.messages);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={() => navigate('/dashboard/messages')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Avatar 
            src={chat.user.avatar} 
            alt={chat.user.name}
            sx={{ mr: 1.5 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {chat.user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: {chat.user.rating}/5
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SwapIcon />}
            component={RouterLink}
            to={`/dashboard/swaps/${chat.swap.id}`}
          >
            View Swap
          </Button>
          <IconButton 
            color="inherit" 
            onClick={() => setShowSwapDetails(!showSwapDetails)}
            sx={{ ml: 1 }}
          >
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Swap details */}
      {showSwapDetails && (
        <Paper sx={{ p: 2, borderRadius: 0 }}>
          <Typography variant="subtitle2" gutterBottom>
            Swap Details {getStatusChip(chat.swap.status)}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ display: 'flex', height: 100 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100 }}
                  image={chat.swap.item.image}
                  alt={chat.swap.item.title}
                />
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="subtitle2" noWrap>
                    {chat.swap.item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {chat.swap.item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card variant="outlined" sx={{ display: 'flex', height: 100 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100 }}
                  image={chat.swap.otherItem.image}
                  alt={chat.swap.otherItem.title}
                />
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="subtitle2" noWrap>
                    {chat.swap.otherItem.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {chat.swap.otherItem.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Messages */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2,
        bgcolor: 'background.default'
      }}>
        {messageGroups.map((group, groupIndex) => (
          <Box key={group.date} sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2 
            }}>
              <Chip label={group.formattedDate} />
            </Box>
            
            {group.messages.map((message, messageIndex) => (
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
                    maxWidth: '70%',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.200',
                    color: message.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {formatTime(message.timestamp)}
                </Typography>
                
                {/* Add ref to the last message for auto-scrolling */}
                {groupIndex === messageGroups.length - 1 && 
                 messageIndex === group.messages.length - 1 && 
                 <div ref={messagesEndRef} />}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      
      {/* Message input */}
      <Paper sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" sx={{ mr: 1 }}>
            <EmojiIcon />
          </IconButton>
          <IconButton color="primary" sx={{ mr: 1 }}>
            <ImageIcon />
          </IconButton>
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            multiline
            maxRows={4}
            variant="outlined"
            size="small"
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;