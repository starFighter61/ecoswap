import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Chip,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Chat as ChatIcon,
  SwapHoriz as SwapIcon,
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data for conversations
const mockConversations = [
  {
    id: 1001,
    user: {
      id: 102,
      name: 'Michael Chen',
      avatar: 'https://via.placeholder.com/150?text=MC'
    },
    lastMessage: {
      text: 'Sure! The collection includes a snake plant, pothos, spider plant, peace lily, and a small succulent. All are healthy and about 6 months old.',
      timestamp: '2023-02-18T15:30:00Z',
      isRead: false,
      sender: 'other'
    },
    unreadCount: 2,
    swap: {
      id: 301,
      status: 'pending',
      item: {
        id: 1,
        title: 'Vintage Leather Jacket',
        image: 'https://via.placeholder.com/300x200?text=Leather+Jacket'
      },
      otherItem: {
        id: 5,
        title: 'Plant Collection',
        image: 'https://via.placeholder.com/300x200?text=Plant+Collection'
      }
    }
  },
  {
    id: 1002,
    user: {
      id: 103,
      name: 'Emma Rodriguez',
      avatar: 'https://via.placeholder.com/150?text=ER'
    },
    lastMessage: {
      text: 'Great! I\'ll see you at Central Park Coffee Shop on Saturday at 3 PM.',
      timestamp: '2023-02-17T10:15:00Z',
      isRead: true,
      sender: 'user'
    },
    unreadCount: 0,
    swap: {
      id: 302,
      status: 'accepted',
      item: {
        id: 11,
        title: 'Yoga Mat',
        image: 'https://via.placeholder.com/300x200?text=Yoga+Mat'
      },
      otherItem: {
        id: 6,
        title: 'Board Game Collection',
        image: 'https://via.placeholder.com/300x200?text=Board+Games'
      }
    }
  },
  {
    id: 1003,
    user: {
      id: 104,
      name: 'David Kim',
      avatar: 'https://via.placeholder.com/150?text=DK'
    },
    lastMessage: {
      text: 'Thanks for the swap! I left a review for you.',
      timestamp: '2023-02-05T16:45:00Z',
      isRead: true,
      sender: 'other'
    },
    unreadCount: 0,
    swap: {
      id: 303,
      status: 'completed',
      item: {
        id: 8,
        title: 'Bluetooth Headphones',
        image: 'https://via.placeholder.com/300x200?text=Headphones'
      },
      otherItem: {
        id: 9,
        title: 'Hiking Backpack',
        image: 'https://via.placeholder.com/300x200?text=Backpack'
      }
    }
  },
  {
    id: 1004,
    user: {
      id: 105,
      name: 'Sophia Lee',
      avatar: 'https://via.placeholder.com/150?text=SL'
    },
    lastMessage: {
      text: 'I\'m sorry, but I\'ve decided to keep the item for now. Maybe next time!',
      timestamp: '2023-01-20T17:30:00Z',
      isRead: true,
      sender: 'other'
    },
    unreadCount: 0,
    swap: {
      id: 304,
      status: 'declined',
      item: {
        id: 10,
        title: 'Ceramic Plant Pots',
        image: 'https://via.placeholder.com/300x200?text=Plant+Pots'
      },
      otherItem: {
        id: 12,
        title: 'Desk Lamp',
        image: 'https://via.placeholder.com/300x200?text=Desk+Lamp'
      }
    }
  }
];

// Mock data for selected conversation messages
const mockMessages = {
  1001: [
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
      isRead: false
    },
    {
      id: 2004,
      sender: 'other',
      text: 'I can send you some pictures if you\'d like to see them.',
      timestamp: '2023-02-18T15:31:00Z',
      isRead: false
    }
  ],
  1002: [
    {
      id: 3001,
      sender: 'user',
      text: 'Hi Emma! I\'m interested in your board game collection. Would you like to swap for my yoga mat?',
      timestamp: '2023-02-16T09:10:00Z',
      isRead: true
    },
    {
      id: 3002,
      sender: 'other',
      text: 'Hello! Yes, I\'d be interested in that swap. Your yoga mat looks like it\'s in great condition.',
      timestamp: '2023-02-16T10:25:00Z',
      isRead: true
    },
    {
      id: 3003,
      sender: 'user',
      text: 'Great! When and where would you like to meet for the swap?',
      timestamp: '2023-02-16T11:15:00Z',
      isRead: true
    },
    {
      id: 3004,
      sender: 'other',
      text: 'How about this Saturday at 3 PM? We could meet at Central Park Coffee Shop.',
      timestamp: '2023-02-16T12:30:00Z',
      isRead: true
    },
    {
      id: 3005,
      sender: 'user',
      text: 'Great! I\'ll see you at Central Park Coffee Shop on Saturday at 3 PM.',
      timestamp: '2023-02-17T10:15:00Z',
      isRead: true
    }
  ]
};

const MessagesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Fetch conversations on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setConversations(mockConversations);
      setFilteredConversations(mockConversations);
      setLoading(false);
    }, 500);
  }, []);

  // Filter conversations when search term or tab changes
  useEffect(() => {
    if (conversations.length > 0) {
      let filtered = [...conversations];
      
      // Filter by tab
      if (tabValue === 1) { // Active swaps
        filtered = filtered.filter(conv => ['pending', 'accepted'].includes(conv.swap.status));
      } else if (tabValue === 2) { // Completed/Declined
        filtered = filtered.filter(conv => ['completed', 'declined', 'cancelled'].includes(conv.swap.status));
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(conv => 
          conv.user.name.toLowerCase().includes(term) ||
          conv.swap.item.title.toLowerCase().includes(term) ||
          conv.swap.otherItem.title.toLowerCase().includes(term)
        );
      }
      
      setFilteredConversations(filtered);
    }
  }, [conversations, searchTerm, tabValue]);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // In a real app, this would be an API call
      const conversationMessages = mockMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
      
      // Mark messages as read
      if (selectedConversation.unreadCount > 0) {
        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              unreadCount: 0,
              lastMessage: {
                ...conv.lastMessage,
                isRead: true
              }
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
        setFilteredConversations(
          filteredConversations.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } } 
              : conv
          )
        );
      }
    }
  }, [selectedConversation]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would be an API call
      const message = {
        id: Date.now(),
        sender: 'user',
        text: newMessage,
        timestamp: new Date().toISOString(),
        isRead: true
      };
      
      // Add message to the conversation
      setMessages([...messages, message]);
      
      // Update last message in conversations list
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            lastMessage: {
              text: newMessage,
              timestamp: new Date().toISOString(),
              isRead: true,
              sender: 'user'
            }
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      setFilteredConversations(
        filteredConversations.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                lastMessage: {
                  text: newMessage,
                  timestamp: new Date().toISOString(),
                  isRead: true,
                  sender: 'user'
                } 
              } 
            : conv
        )
      );
      
      setNewMessage('');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    } else {
      return date.toLocaleDateString();
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
        Messages
      </Typography>
      
      <Grid container spacing={3}>
        {/* Conversations list */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="All" />
              <Tab label="Active" />
              <Tab label="Archived" />
            </Tabs>
            
            {/* Search */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <FilterListIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            </Box>
            
            {/* Conversations */}
            <List sx={{ overflow: 'auto', flexGrow: 1 }}>
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <React.Fragment key={conversation.id}>
                    <ListItem
                      button
                      selected={selectedConversation?.id === conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      sx={{ 
                        bgcolor: conversation.unreadCount > 0 ? 'action.hover' : 'transparent',
                        py: 1.5
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="error"
                          badgeContent={conversation.unreadCount}
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                        >
                          <Avatar src={conversation.user.avatar} alt={conversation.user.name} />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="subtitle1" 
                            fontWeight={conversation.unreadCount > 0 ? 'bold' : 'normal'}
                            noWrap
                          >
                            {conversation.user.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                flexGrow: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                mr: 1,
                                fontWeight: conversation.unreadCount > 0 && conversation.lastMessage.sender === 'other' ? 'bold' : 'normal'
                              }}
                            >
                              {conversation.lastMessage.sender === 'user' ? 'You: ' : ''}
                              {conversation.lastMessage.text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    No conversations found
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Message thread */}
        <Grid item xs={12} md={8}>
          {selectedConversation ? (
            <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              {/* Conversation header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={selectedConversation.user.avatar} 
                  alt={selectedConversation.user.name}
                  sx={{ mr: 1.5 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    {selectedConversation.user.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SwapIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {selectedConversation.swap.item.title} ↔ {selectedConversation.swap.otherItem.title}
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      {getStatusChip(selectedConversation.swap.status)}
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  component={RouterLink}
                  to={`/dashboard/swaps/${selectedConversation.swap.id}`}
                >
                  View Swap
                </Button>
              </Box>
              
              {/* Messages */}
              <Box sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                p: 2,
                display: 'flex',
                flexDirection: 'column-reverse' // To scroll to bottom by default
              }}>
                <Box>
                  {messages.map((message) => (
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
                    </Box>
                  ))}
                </Box>
              </Box>
              
              {/* Message input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          color="primary" 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <ChatIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Paper>
          ) : (
            <Card sx={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ textAlign: 'center', maxWidth: 400 }}>
                <ChatIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a conversation from the list to view messages and continue your discussion about swaps.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage;