import React from "react";
import { Button, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Navigate } from "react-router-dom";
import Chatbox from "../../components/chatbox";

const Dashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Fixed Header */}
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </Box>

      {/* Sidebar & Content Wrapper */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => {
          logout();
          navigate('/auth/login');
        }}
      >
        Logout
      </Button>

      <Box sx={{ display: "flex", flexGrow: 1, marginTop: "64px" }}> {/* Push below Header */}
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
      <Chatbox/>
        
      </Box>
    </Box>
  );
};

export default Dashboard;
