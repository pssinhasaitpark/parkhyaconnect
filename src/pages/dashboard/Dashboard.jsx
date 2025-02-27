import React from "react";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Fixed Header */}
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <Header />
      </Box>

      {/* Sidebar & Content Wrapper */}
      <Box sx={{ display: "flex", flexGrow: 1, marginTop: "64px" }}> {/* Push below Header */}
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        
      </Box>
    </Box>
  );
};

export default Dashboard;
