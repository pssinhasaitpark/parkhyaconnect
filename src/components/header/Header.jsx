import React from "react";
import { AppBar, Toolbar, InputBase, Box, Button, IconButton } from "@mui/material";
import { Search, QuestionMark, ArrowBack, ArrowForward, AccessTime } from "@mui/icons-material";

const Header = () => {
  return (
    <AppBar className="" position="static" sx={{ backgroundColor: "#3f0e40", padding: "10px" }}>
      <Toolbar>
        {/* Back & Forward Buttons */}
        <IconButton color="inherit" sx={{ marginRight: 2 }}>
          <ArrowBack />
        </IconButton>
        <IconButton color="inherit" sx={{ marginRight: 2 }}>
          <ArrowForward />
        </IconButton>
        

        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", mx: 2, backgroundColor: "#5a2a68", borderRadius: 2, paddingX: 2 }}>
          <Search sx={{ color: "#fff", mr: 1 }} />
          <InputBase placeholder="Search channels or messages..." sx={{ color: "white", flex: 1 }} />
        </Box>

        {/* Time Icon */}
        <IconButton color="inherit">
          <AccessTime sx={{ color: "#fff" }} />
        </IconButton>

        {/* Slack Pro Trial Button */}
        <Button variant="contained" color="secondary" sx={{ ml: 2, backgroundColor: "#9146ff" }}>
          Upgrade to Slack Pro 
        </Button>

        {/* Help Button */}
        <IconButton color="inherit">
          <QuestionMark />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
