import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Switch,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Lock, Notifications } from "@mui/icons-material";

const NotificationsPanel = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showUnread, setShowUnread] = useState(false);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const notifications = [
    {
      type: "Thread",
      group: "devConnect",
      name: "Rahul Sharma, Neha, and you",
      message: "replied to: The authentication flow is complete, and we're testing the API integration.",
      time: "2:17 PM",
      avatar: "https://via.placeholder.com/40", // Placeholder Avatar
    },
    {
      type: "Mention",
      group: "projectCollab",
      name: "Amit Verma",
      message: "@you Can you review the latest UI updates?",
      time: "2:13 PM",
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "Channel Invitation",
      name: "Tech Innovators",
      message: "invited you to join #next-gen-ai-discussion",
      time: "Yesterday",
      avatar: "https://via.placeholder.com/40",
    },
  ];
  
  return (
    <Box
      sx={{
        maxWidth: 400, // Notification panel width
        height: "100vh",
        bgcolor: "#290b2c",
        color: "white",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Header (Tabs + Toggle) */}
      <Box sx={{ position: "sticky", top: 0, bgcolor: "#290b2c", zIndex: 10, pb: 1 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Activity</Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body2">Unread messages</Typography>
            <Switch checked={showUnread} onChange={() => setShowUnread(!showUnread)} />
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            minHeight: "30px",
            "& .MuiTab-root": { fontSize: "0.8rem", minWidth: "auto", padding: "6px 12px" },
            "& .MuiTabs-indicator": { backgroundColor: "#fff" },
          }}
        >
          <Tab label="All" />
          <Tab label="Mentions" />
          <Tab label="Threads" />
          <Tab label="Reactions" />
          <Tab label="Invitations" />
          <Tab label="Apps" />
        </Tabs>
      </Box>

      {/* Notifications List (Scrollable with Hidden Scrollbar) */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <List>
          {notifications.map((notif, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                display: showUnread && index !== 0 ? "none" : "flex",
                alignItems: "flex-start",
                padding: "12px 0",
              }}
            >
              <ListItemAvatar>
                <Avatar src={notif.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {notif.type === "Thread" && (
                      <Typography variant="body2" sx={{ color: "#aaa", fontSize: "0.8rem" }}>
                        🔒 Thread in <Lock fontSize="small" sx={{ verticalAlign: "middle", fontSize: "1rem" }} />{" "}
                        {notif.group}
                      </Typography>
                    )}
                    {notif.type === "Mention" && (
                      <Typography variant="body2" sx={{ color: "#aaa", fontSize: "0.8rem" }}>
                        🔒 Mention in <Lock fontSize="small" sx={{ verticalAlign: "middle", fontSize: "1rem" }} />{" "}
                        {notif.group}
                      </Typography>
                    )}
                    {notif.type === "Channel Invitation" && (
                      <Typography variant="body2" sx={{ color: "#aaa", fontSize: "0.8rem" }}>
                        # Channel Invitation
                      </Typography>
                    )}
                    <Typography fontWeight="bold">{notif.name}</Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography sx={{ color: "#ccc", fontSize: "0.85rem" }}>{notif.message}</Typography>
                    <Typography variant="caption" sx={{ color: "#999", display: "block", mt: 1 }}>
                      {notif.time}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default NotificationsPanel;
