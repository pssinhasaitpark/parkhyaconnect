import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Message } from "@mui/icons-material";
import DMInterface from "../../components/ChatBox/DMInterface";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null); 
  const currentUser = useSelector((state) => state.auth.user); 

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
      <Box sx={{ display: "flex", flexGrow: 1, marginTop: "64px", height: "calc(100vh - 64px)" }}>
        <Sidebar onUserSelect={handleUserSelect} />

        {/* <Box sx={{ flexGrow: 1, height: "100%", display: "flex", paddingLeft: "18%", justifyContent: "center", alignItems: "center" }}>
          {selectedUser ? (
            <DMInterface user={selectedUser} />
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
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
