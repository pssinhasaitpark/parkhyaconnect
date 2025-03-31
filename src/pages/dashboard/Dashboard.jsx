import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import DMInterface from "../../components/ChatBox/DMInterface";
import ChannelChatUI from "../../components/ChatBox/ChannelChatUI"; 

const Dashboard = () => {
  const [selectedUser , setSelectedUser ] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null); // State for the selected channel
  const currentUser  = useSelector((state) => state.auth.user);

  const handleUserSelect = (user) => {
    setSelectedUser (user);
    setSelectedChannel(null); // Close ChannelChatUI when a user is selected
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setSelectedUser (null); // Close DMInterface when a channel is selected
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
          onUserSelect={(user) => {
            handleUserSelect(user);
          }}
          onChannelSelect={(channel) => {
            handleChannelSelect(channel);
          }}
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
          {/* Show DMInterface or ChannelChatUI based on the selected user or channel */}
          {selectedUser  ? (
            <DMInterface
              selectedUser ={selectedUser }
              onClose={() => setSelectedUser (null)} // Close DMInterface
            />
          ) : selectedChannel ? (
            <ChannelChatUI
              channel={selectedChannel}
              onClose={() => setSelectedChannel(null)} // Close ChannelChatUI
            />
          ) : (
            // Show the default message when no user or channel is selected
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                sx={{ color: "black", fontSize: 50, marginBottom: "20px" }}
              >
                {/* <Message /> */}
              </IconButton>
              <Typography variant="h6" sx={{ color: "purple" }}>
                Select a user or channel to start chatting
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
