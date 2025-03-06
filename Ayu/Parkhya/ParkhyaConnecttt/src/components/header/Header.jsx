import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice"; // Import the logout action
import { AppBar, Toolbar, InputBase, Box, Button, IconButton } from "@mui/material";
import { Search, QuestionMark, ArrowBack, ArrowForward, AccessTime } from "@mui/icons-material";
import SlackProPopup from "../subSection/ProVersion"; // Import the Popup Component

const Header = () => {
  const dispatch = useDispatch(); // Initialize dispatch

  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };
  const [open, setOpen] = useState(false);

  return (
    <>
     <AppBar 
  position="fixed" 
  sx={{ 
    backgroundColor: "#401d42", 
    width: "100%", 
    left: 0, 
    top: 0, 
    zIndex: 1100, // Ensure it appears above everything 
  }}
>
  <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    {/* Left Section - Back & Forward Buttons */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton color="inherit">
        <ArrowBack />
      </IconButton>
      <IconButton color="inherit">
        <ArrowForward />
      </IconButton>
    </Box>

    {/* Center - Search Bar */}
    <Box 
      sx={{ 
        flexGrow: 1, 
        maxWidth: "500px", 
        display: "flex", 
        alignItems: "center", 
        backgroundColor: "#5a2a68", 
        borderRadius: 2, 
        paddingX: 2 
      }}
    >
      <Search sx={{ color: "#fff", mr: 1 }} />
      <InputBase placeholder="Search..." sx={{ color: "white", flex: 1 }} />
    </Box>

    {/* Right Section - Time Icon, Buttons, Help */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <IconButton color="inherit">
        <AccessTime />
      </IconButton>

      <Button variant="contained" sx={{ backgroundColor: "#9146ff" }} onClick={() => setOpen(true)}>
        Slack Pro
      </Button>

      <Button variant="contained" sx={{ backgroundColor: "#9146ff" }} onClick={handleLogout}>
        Logout
      </Button>

      <IconButton color="inherit">
        <QuestionMark />
      </IconButton>
    </Box>
  </Toolbar>
</AppBar>


      {/* Slack Pro Popup Component */}
      <SlackProPopup open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
