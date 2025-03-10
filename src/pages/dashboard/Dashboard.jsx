import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box, Typography } from "@mui/material";
import ChatUI from "../../components/ChatBox/ChatUI";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null); // State to manage selected user
  const currentUser = useSelector((state) => state.auth.user); // Retrieve current user from Redux state

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Fixed Header */}
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </Box>

      {/* Sidebar & Main Content */}
      <Box sx={{ display: "flex", flexGrow: 1, marginTop: "64px", height: "calc(100vh - 64px)" }}>
        {/* Sidebar - Left */}
        <Sidebar onUserSelect={handleUserSelect} /> {/* Pass user selection handler to Sidebar */}

        {/* Chat UI - Conditionally Rendered */}
        {selectedUser ? (
          <Box sx={{ flexGrow: 1, height: "100%", display: "flex", paddingLeft: "18%" }}>
            <ChatUI user={selectedUser} currentUser={currentUser} /> 
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, height: "100%", display: "flex", paddingLeft: "18%" }}>
            <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
              Select a user to start chatting
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
