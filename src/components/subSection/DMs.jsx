import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  Badge,
  Switch,
} from "@mui/material";
import { Search, Edit } from "@mui/icons-material";

const DMs = () => {
  const [showUnread, setShowUnread] = useState(false);

  const users = [
    { name: "Alice", message: "See you soon!", time: "2:30 PM", unread: 2, online: true, avatar: "" },
    { name: "Bob", message: "Let's meet up", time: "1:45 PM", unread: 0, online: false, avatar: "" },
    { name: "Charlie", message: "Check your email", time: "12:10 PM", unread: 1, online: true, avatar: "" },
    { name: "David", message: "Good morning!", time: "10:05 AM", unread: 0, online: true, avatar: "" },
    { name: "Eve", message: "Are you coming?", time: "9:30 AM", unread: 3, online: false, avatar: "" },
    { name: "Frank", message: "Call me later", time: "8:20 AM", unread: 0, online: false, avatar: "" },
    { name: "Grace", message: "Meeting rescheduled", time: "7:15 AM", unread: 2, online: true, avatar: "" },
    { name: "Hank", message: "Let's catch up", time: "6:50 AM", unread: 0, online: true, avatar: "" },
    { name: "Ivy", message: "See you at 5", time: "5:25 AM", unread: 1, online: false, avatar: "" },
    { name: "Jack", message: "Lunch at noon?", time: "4:10 AM", unread: 0, online: false, avatar: "" },
    { name: "Admin", message: "System update complete", time: "3:00 AM", unread: 0, online: false, avatar: "https://via.placeholder.com/40" }, 
  ];

  return (
    <Box
      sx={{
        maxWidth: 320, // Sidebar width
        height: "100vh",
        bgcolor: "#290b2c",
        color: "white",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Header */}
      <Box sx={{ position: "sticky", top: 0, bgcolor: "#290b2c", zIndex: 10, pb: 2 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Direct Messages</Typography>
          <IconButton sx={{ color: "white" }}>
            <Edit />
          </IconButton>
        </Box>

        {/* Search Input */}
        <Box display="flex" alignItems="center" bgcolor="#3b1e3d" borderRadius="4px" padding="4px" mt={1} mb={1}>
          <Search sx={{ color: "#aaa", marginRight: 1 }} />
          <TextField
            variant="standard"
            placeholder="Find a DM"
            fullWidth
            InputProps={{ disableUnderline: true, style: { color: "white" } }}
          />
        </Box>

        {/* Unread Messages Toggle */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">Unread messages</Typography>
          <Switch checked={showUnread} onChange={() => setShowUnread(!showUnread)} />
        </Box>
      </Box>

      {/* Scrollable List (with hidden scrollbar) */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Chrome/Safari
        }}
      >
        <List>
          {users.map((user, index) => (
            <ListItem
              key={index}
              button
              sx={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: showUnread && user.unread === 0 ? "none" : "flex",
                alignItems: "center",
              }}
            >
              <ListItemAvatar>
                <Badge
                  variant="dot"
                  color={user.online ? "success" : "default"}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <Avatar src={user.avatar}>{user.avatar ? "" : user.name[0]}</Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography fontWeight={user.unread > 0 ? "bold" : "normal"}>{user.name}</Typography>}
                secondary={user.message}
                sx={{ color: "#ccc" }}
              />
              {user.unread > 0 && (
                <Badge badgeContent={user.unread} color="error" sx={{ marginRight: "8px" }} />
              )}
              {user.time && (
                <Typography variant="caption" sx={{ color: "#999" }}>
                  {user.time}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default DMs;
