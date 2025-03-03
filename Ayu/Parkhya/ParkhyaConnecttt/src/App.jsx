import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/signup/Signup";
import Login from "./pages/auth/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ResetPassword from "./pages/auth/ResetPassword"; // Importing ResetPassword component
import ForgotPassword from "./pages/auth/ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> {/* Accessible without authentication */}
          <Route path="/dashboard" element={<DashboardWrapper />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const LoginWrapper = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Login />;
};

const DashboardWrapper = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <Navigate to="/auth/login" />;
};

export default App;
