import React from "react";
import { List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from "@mui/material";
import { AutoAwesome, Workspaces, Storage, ViewList, InsertDriveFile, Groups, People, Link } from "@mui/icons-material";

const MoreComponent = () => {
  const menuItems = [
    { label: "Templates", icon: <AutoAwesome />, isNew: true },
    { label: "Automations", icon: <Workspaces />, isNew: true },
    { label: "Canvases", icon: <Storage />, isNew: true },
    { label: "Lists", icon: <ViewList /> },
    { label: "Files", icon: <InsertDriveFile /> },
    { label: "Channels", icon: <Groups /> },
    { label: "People", icon: <People /> },
  ];

  return (
    <Box sx={{ width: 250, bgcolor: "#3a3a3a", color: "white", borderRadius: 2, p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
        More
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.label}>
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            {item.isNew && (
              <Typography variant="caption" sx={{ color: "#ff4081", ml: 1 }}>
                NEW
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 1 }} />
      <ListItem button>
        <ListItemIcon sx={{ color: "white" }}>
          <Link />
        </ListItemIcon>
        <ListItemText primary="External connections" />
      </ListItem>
    </Box>
  );
};

export default MoreComponent;
