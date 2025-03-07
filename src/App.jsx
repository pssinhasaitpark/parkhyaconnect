import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { initializeAuth } from './redux/authSlice';
import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import SlackChatUI from './components/ChatBox/ChatUI';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication on app load
  useEffect(() => {
    // Call the new initialization action
    dispatch(initializeAuth());
    setIsInitialized(true);
    
    // Debug: Log authentication state
    console.log("App initialization - Auth state:", {
      isAuthenticated,
      token: localStorage.getItem('token')
    });
  }, [dispatch]);

  // Wait for initialization before rendering routes
  if (!isInitialized) {
    // You could add a loading spinner here if needed
    return null;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/chat/:id" element={isAuthenticated ? <SlackChatUI /> : <Navigate to="/login" />} /> 
      </Routes>
    </Router>
  );
}

export default App;