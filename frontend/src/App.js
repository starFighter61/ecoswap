import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useAuth } from './context/AuthContext';
import { useSocket } from './context/SocketContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ItemsPage from './pages/items/ItemsPage';
import ItemDetailPage from './pages/items/ItemDetailPage';
import UserProfilePage from './pages/users/UserProfilePage';

// Protected pages
import Dashboard from './pages/dashboard/Dashboard';
import MyItemsPage from './pages/dashboard/MyItemsPage';
import AddItemPage from './pages/dashboard/AddItemPage';
import EditItemPage from './pages/dashboard/EditItemPage';
import MySwapsPage from './pages/dashboard/MySwapsPage';
import SwapDetailPage from './pages/dashboard/SwapDetailPage';
import MessagesPage from './pages/dashboard/MessagesPage';
import ChatPage from './pages/dashboard/ChatPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ImpactPage from './pages/dashboard/ImpactPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { isAuthenticated, user } = useAuth();
  const { connectSocket, disconnectSocket } = useSocket();
  
  // Connect to socket when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket();
      
      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, user, connectSocket, disconnectSocket]);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="lg">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/items"
              element={
                <ProtectedRoute>
                  <MyItemsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/items/add"
              element={
                <ProtectedRoute>
                  <AddItemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/items/edit/:id"
              element={
                <ProtectedRoute>
                  <EditItemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/swaps"
              element={
                <ProtectedRoute>
                  <MySwapsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/swaps/:id"
              element={
                <ProtectedRoute>
                  <SwapDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/messages/:swapId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/impact"
              element={
                <ProtectedRoute>
                  <ImpactPage />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
}

export default App;