import React, { useState } from "react";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box } from "@mui/material";
import ChatUI from "../../components/ChatBox/ChatUI";

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);

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
        <Sidebar onUserSelect={handleUserSelect} />

        {/* Chat UI - Conditionally Rendered */}
        {selectedUser && (
          <Box sx={{ flexGrow: 1, height: "100%", display: "flex", paddingLeft: "18%" }}>
            <ChatUI user={selectedUser} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;