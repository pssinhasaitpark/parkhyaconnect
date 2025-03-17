import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/login/Login';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import PrivateRoutes from './components/routes/privateRoutes/PrivateRoutes.jsx'; 

const App = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   const currentPath = window.location.pathname;

  //   if (!token && currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/forgot-password' && currentPath !== '/reset-password') {
  //     localStorage.removeItem('token');
  //     navigate('/login');
  //   }
  // }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
