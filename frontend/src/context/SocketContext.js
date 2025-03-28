import React, { createContext, useContext, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Create context
const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  // Connect to socket
  const connectSocket = useCallback(() => {
    if (isAuthenticated && user && !socket) {
      // Use the environment variable or fallback to relative path for local development
      const socketUrl = process.env.REACT_APP_SOCKET_URL || window.location.origin;
      console.log('Connecting to socket at:', socketUrl);
      
      const newSocket = io(socketUrl, {
        auth: {
          userId: user._id
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        setConnected(false);
      });

      // Handle incoming messages
      newSocket.on('receive_message', (data) => {
        // Only notify if the message is from someone else
        if (data.sender._id !== user._id) {
          console.log(`New message from ${data.sender.firstName}: ${data.content.substring(0, 30)}${data.content.length > 30 ? '...' : ''}`);
          // Notification will be handled by the component
        }
      });

      // Handle swap status updates
      newSocket.on('swap_update', (data) => {
        let message = '';
        
        switch (data.status) {
          case 'accepted':
            message = `Your swap request for ${data.item.title} has been accepted!`;
            break;
          case 'rejected':
            message = `Your swap request for ${data.item.title} has been rejected.`;
            break;
          case 'completed':
            message = `Your swap for ${data.item.title} has been marked as completed.`;
            break;
          case 'cancelled':
            message = `A swap for ${data.item.title} has been cancelled.`;
            break;
          default:
            message = `A swap status has been updated to ${data.status}.`;
        }
        
        console.log(message);
        // Notification will be handled by the component
      });

      // Handle new swap requests
      newSocket.on('new_swap_request', (data) => {
        console.log(`New swap request for your item: ${data.item.title}`);
        // Notification will be handled by the component
      });

      // Handle new reviews
      newSocket.on('new_review', (data) => {
        console.log(`${data.reviewer.firstName} left you a ${data.rating}-star review!`);
        // Notification will be handled by the component
      });

      setSocket(newSocket);
    }
  }, [isAuthenticated, user, socket]);

  // Disconnect socket
  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
    }
  }, [socket]);

  // Join a chat room
  const joinChatRoom = useCallback((roomId) => {
    if (socket && connected) {
      socket.emit('join_room', roomId);
    }
  }, [socket, connected]);

  // Send a message
  const sendMessage = useCallback((data) => {
    if (socket && connected) {
      socket.emit('send_message', data);
    }
  }, [socket, connected]);

  // Send typing indicator
  const sendTyping = useCallback((data) => {
    if (socket && connected) {
      socket.emit('typing', data);
    }
  }, [socket, connected]);

  // Value to be provided by the context
  const value = {
    socket,
    connected,
    connectSocket,
    disconnectSocket,
    joinChatRoom,
    sendMessage,
    sendTyping
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};