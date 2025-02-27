import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, IconButton, Box   } from "@mui/material";
import { Home, ChatBubble, Notifications, MoreHoriz, AddCircle, AccountCircle } from "@mui/icons-material";

const Sidebar = () => {
  const [subSliderOpen, setSubSliderOpen] = useState(false);

  const toggleSubSlider = (open) => () => {
    setSubSliderOpen(open);
  };

  return (
    <>
      {/* Main Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 72,
          "& .MuiDrawer-paper": {
            width: 72,
            bgcolor: "#401d42",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 2,
            borderRight: "none",
          },
        }}
      >
        {/* Logo/Icon at Top */}
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: "gray",
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>PS</span>
        </Box>

        {/* Navigation Icons */}
        <List sx={{ width: "100%" }}>
          <ListItem button sx={{ justifyContent: "center" }}>
            <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
              <Home />
            </ListItemIcon>
          </ListItem>
          <ListItem button sx={{ justifyContent: "center" }}>
            <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
              {/* <Badge badgeContent={7} color="error"> */}
                <ChatBubble />
              {/* </Badge> */}
            </ListItemIcon>
          </ListItem>
          <ListItem button sx={{ justifyContent: "center" }}>
            <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
              <Notifications />
            </ListItemIcon>
          </ListItem>
          <ListItem button sx={{ justifyContent: "center" }} onClick={toggleSubSlider(true)}>
            <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
              <MoreHoriz />
            </ListItemIcon>
          </ListItem>
        </List>

        {/* Spacer to push buttons to bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Floating Add Button */}
        <IconButton sx={{ color: "white", mb: 2 }}>
          <AddCircle fontSize="large" />
        </IconButton>

        {/* Profile Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: "white",
            borderRadius: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            mb: 2,
          }}
        >
          <AccountCircle sx={{ color: "gold", fontSize: 32 }} />
          <Box
            sx={{
              width: 10,
              height: 10,
              bgcolor: "green",
              borderRadius: "50%",
              position: "absolute",
              bottom: 2,
              right: 2,
              border: "2px solid white",
            }}
          />
        </Box>
      </Drawer>

      {/* Sub-Slider */}
      <Drawer
        anchor="left"
        open={subSliderOpen}
        onClose={toggleSubSlider(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 200,
            bgcolor: "#3E014F",
            color: "white",
          },
        }}
      >
        <List>
          <ListItem button>
            <ListItemIcon sx={{ color: "white" }}>
              <Home />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemIcon sx={{ color: "white" }}>
              <ChatBubble />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;