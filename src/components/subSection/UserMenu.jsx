import React, { useEffect } from "react";
import { fetchUserDetails } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  Avatar,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";

const UserMenu = ({ anchorEl, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userDetails = useSelector((state) => state.auth.userDetails || state.auth.currentUser);

  useEffect(() => {
    if (token && !userDetails) {
      dispatch(fetchUserDetails());
    }
    console.log("Redux userDetails:", userDetails);
    console.log("Redux token:", token);
  }, [dispatch, token, userDetails]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getUserName = () => {
    return userDetails?.fullName || "User";
  };

  const getUserAvatar = () => {
    return userDetails?.avatar || "default-avatar.png";
  };

  const getInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
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
        <Avatar
          src={getUserAvatar()}
          sx={{ bgcolor: "#aaa", color: "black" }}
        >
          {!getUserAvatar() && getInitial()}
        </Avatar>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {getUserName()}
          </Typography>
          <Typography variant="body2" color="gray">
            Online
          </Typography>
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
        <Divider sx={{ bgcolor: "gray", my: 1 }} />
        <ListItem button onClick={handleLogout}>
          <ListItemText
            primary="Sign out of Parkhya Solutions"
            sx={{ color: "red" }}
          />
        </ListItem>
      </List>
    </Popover>
  );
};

export default UserMenu;