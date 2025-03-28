import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box, IconButton, Typography } from "@mui/material";
// import { Message } from "@mui/icons-material";
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
      <Box sx={{
        display: "flex",
        flexGrow: 1,
        marginTop: "64px",
        height: "calc(100vh - 64px)",
        flexDirection: { xs: "column", sm: "row" },
      }}>
        <Sidebar
          onUserSelect={handleUserSelect}
          sx={{
            display: { xs: "none", sm: "block" },
            width: { sm: "20%", xs: "100%" },
            position: { sm: "fixed", xs: "relative" },
          }}
        />

        {/* Chat area */}
        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            paddingLeft: { xs: 0, sm: "18%" },
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Show DMInterface only when a user is selected */}
          {selectedUser ? (
            <DMInterface
              selectedUser={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          ) : (
            // Show the default message when no user is selected
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                sx={{ color: "black", fontSize: 50, marginBottom: "20px" }}
              >
                {/* <Message /> */}
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