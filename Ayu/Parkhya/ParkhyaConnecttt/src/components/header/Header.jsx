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
      <AppBar position="static" sx={{ backgroundColor: "#401d42", padding: "5px" }}>
        <Toolbar>
          {/* Back & Forward Buttons */}
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
          <IconButton color="inherit">
            <ArrowForward />
          </IconButton>

          {/* Search Bar */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", mx: 2, backgroundColor: "#5a2a68", borderRadius: 2, paddingX: 2 }}>
            <Search sx={{ color: "#fff", mr: 1 }} />
            <InputBase placeholder="Search..." sx={{ color: "white", flex: 1 }} />
          </Box>

          {/* Time Icon */}
          <IconButton color="inherit">
            <AccessTime />
          </IconButton>

          {/* Slack Pro Trial Button */}
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ ml: 2, backgroundColor: "#9146ff" }} 
            onClick={() => setOpen(true)}
          >
            Slack Pro 
          </Button>

          {/* Logout Button */}
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ ml: 2, backgroundColor: "#9146ff" }} 
            onClick={handleLogout} // Call handleLogout on click
          >
            Logout
          </Button>

          {/* Help Button */}
          <IconButton color="inherit">
            <QuestionMark />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Slack Pro Popup Component */}
      <SlackProPopup open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
