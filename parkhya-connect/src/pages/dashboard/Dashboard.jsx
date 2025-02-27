import React from "react";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/Sidebar";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Box sx={{ p: 3 }}> 
          {/* Add your page content here */}
          <h1 >Dashboard Content</h1>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;