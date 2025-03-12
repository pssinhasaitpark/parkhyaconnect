import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/login/Login';
import Dashboard from './pages/dashboard/Dashboard.jsx'
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
const App = () => {


  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>

  );
}

export default App;