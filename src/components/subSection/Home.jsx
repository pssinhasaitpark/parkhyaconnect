import React, { useState } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemText, Collapse, Typography, Avatar } from "@mui/material";
import { ExpandLess, ExpandMore, Add } from "@mui/icons-material";

const Home = ({ onUserSelect }) => {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);

  // Randomized user names with random notifications
  const users = [
    { name: "Alice Johnson", notifications: Math.floor(Math.random() * 5) },
    { name: "Bob Smith", notifications: Math.floor(Math.random() * 5) },
    { name: "Charlie Williams", notifications: Math.floor(Math.random() * 5) },
    { name: "David Lee", notifications: Math.floor(Math.random() * 5) },
    { name: "Emma Brown", notifications: Math.floor(Math.random() * 5) },
    { name: "Frank White", notifications: Math.floor(Math.random() * 5) },
    { name: "Grace Harris", notifications: Math.floor(Math.random() * 5) },
    { name: "Hannah Clark", notifications: Math.floor(Math.random() * 5) },
    { name: "Ivy King", notifications: Math.floor(Math.random() * 5) },
    { name: "Jack Moore", notifications: Math.floor(Math.random() * 5) },
  ];

  // Randomized channel names
  const channels = [
    "team-alpha",
    "marketing-updates",
    "design-feedback",
    "dev-discussions",
    "product-ideas",
  ];

  return (
    <Box
      sx={{
        width: 320,
        height: "100vh",
        bgcolor: "#290b2c",
        color: "white",
        position: "fixed",
        left: 72,
        padding: 2,
      }}
    >
      <Typography variant="h6">Parkhya Solutions</Typography>

      {/* Channels Section */}
      <List>
        <ListItem button onClick={() => setChannelsOpen(!channelsOpen)}>
          <ListItemText primary="Channels" />
          {channelsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={channelsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {channels.map((channel) => (
              <ListItem button key={channel} sx={{ pl: 2 }}>
                <ListItemText primary={`# ${channel}`} />
              </ListItem>
            ))}
            <ListItem button sx={{ pl: 2 }}>
              <ListItemIcon>
                <Add sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Add Channel" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      {/* Direct Messages Section */}
      <List>
        <ListItem button onClick={() => setDmsOpen(!dmsOpen)}>
          <ListItemText primary="Direct Messages" />
          {dmsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={dmsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {users.map((user) => (
              <ListItem button key={user.name} sx={{ pl: 2 }} onClick={() => onUserSelect(user)}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24 }}>{user.name[0]}</Avatar>
                </ListItemIcon>
                <ListItemText primary={user.name} />
                {user.notifications > 0 && (
                  <Box
                    sx={{
                      bgcolor: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }}
                  >
                    {user.notifications}
                  </Box>
                )}
              </ListItem>
            ))}
            <ListItem button sx={{ pl: 2 }}>
              <ListItemIcon>
                <Add sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Add Colleagues" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Home;