import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Message } from "@mui/icons-material";
import DMInterface from "../../components/ChatBox/DMInterface";
import DMInterface2 from "../../components/ChatBox/DMInterface2";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null); 
  const currentUser = useSelector((state) => state.auth.user); 
  const theme = useTheme(); // Material UI theme for breakpoints

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </Box>

      {/* Sidebar and Main Content */}
      <Box sx={{
        display: "flex",
        flexGrow: 1,
        marginTop: "64px",
        height: "calc(100vh - 64px)",
        flexDirection: { xs: "column", sm: "row" }, // Adjust layout for small screens
      }}>
        <Sidebar onUserSelect={handleUserSelect} sx={{
          display: { xs: "none", sm: "block" }, // Hide sidebar on small screens
          width: { sm: "20%", xs: "100%" }, // Adjust sidebar width for small screens
          position: { sm: "fixed", xs: "relative" }, // Fix sidebar on large screens
        }} />

        {/* Chat area */}
        <Box sx={{
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingLeft: { xs: 0, sm: "18%" }, // Adjust padding for small screens
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}>
          {selectedUser ? (
            <DMInterface selectedUser={selectedUser} selectedChannel={null} />
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <IconButton sx={{ color: "black", fontSize: 50, marginBottom: "20px" }}>
                <Message />
              </IconButton>
              <Typography variant="h6" sx={{ color: "purple" }}>
                Select a user to start chatting
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
