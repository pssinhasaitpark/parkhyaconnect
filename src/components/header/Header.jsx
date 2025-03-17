import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice"; 
import { AppBar, Toolbar, InputBase, Box, Button, IconButton } from "@mui/material";
import { Search, QuestionMark, ArrowBack, ArrowForward, AccessTime } from "@mui/icons-material";
import SlackProPopup from "../subSection/ProVersion"; 
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch(); 
const navigate =useNavigate();
  const handleLogout = () => {
    dispatch(logout()); 
    navigate ("/login");
  };
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#401d42", padding: "5px" }}>
        <Toolbar>
      
          <IconButton color="inherit">
            <ArrowBack />
          </IconButton>
          <IconButton color="inherit">
            <ArrowForward />
          </IconButton>

         
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", mx: 4, backgroundColor: "#5a2a68", borderRadius: 2, paddingX: 2 }}>
            <Search sx={{ color: "#fff", mr: 1 }} />
            <InputBase placeholder="Search..." sx={{ color: "white", flex: 1 }} />
          </Box>

         
          <IconButton color="inherit">
            <AccessTime />
          </IconButton>

          
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ ml: 2, backgroundColor: "#9146ff" }} 
            onClick={() => setOpen(true)}
          >
            Slack Pro 
          </Button>

         
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ ml: 2, backgroundColor: "#9146ff" }} 
            onClick={handleLogout} 
          >
            Logout
          </Button>

         
          <IconButton color="inherit">
            <QuestionMark />
          </IconButton>
        </Toolbar>
      </AppBar>

     
      <SlackProPopup open={open} handleClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
