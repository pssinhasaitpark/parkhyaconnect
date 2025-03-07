import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Popover, Avatar, Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

const UserMenu = ({ anchorEl, onClose, logoutUser, selectedUser }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logoutUser(); // Call the logout function passed as a prop
    navigate('/login'); // Redirect to the login page after logout (or dashboard if needed)
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiPaper-root": {
          bgcolor: "#3a3a3a",
          color: "white",
          padding: 2,
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          minWidth: 200,
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ bgcolor: "#aaa", color: "black" }}>PS</Avatar>
        <Box>
          <Typography variant="body1" fontWeight="bold">{selectedUser ? selectedUser.fullName : 'Select a user'}</Typography>
          <Typography variant="body2" color="gray">Active</Typography>
        </Box>
      </Box>
      <Divider sx={{ bgcolor: "gray", my: 1 }} />
      <List>
        <ListItem button>
          <ListItemText primary="Update your status" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Set yourself as away" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Pause notifications" />
        </ListItem>
        <Divider sx={{ bgcolor: "gray", my: 1 }} />
        <ListItem button>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Preferences" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Downloads" />
        </ListItem>
        <Divider sx={{ bgcolor: "gray", my: 1 }} />
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Sign out of Parkhya Solutions" sx={{ color: "red" }} />
        </ListItem>
      </List>
    </Popover>
  );
};

export default UserMenu;
