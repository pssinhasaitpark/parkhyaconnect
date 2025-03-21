import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton, Avatar, Popover } from "@mui/material";
import { HomeOutlined, ChatBubbleOutline, NotificationsNone, MoreHoriz, Add, Person } from "@mui/icons-material";
import Home from "../subSection/Home";
import DMs from "../subSection/DMs"; // Correct import for DMs component
import ActivityComponent from "../subSection/Activity";
import MoreComponent from "../subSection/More";
import UserMenu from "../subSection/UserMenu"; // Import UserMenu
import { useSelector } from "react-redux"; // Import useSelector

const Sidebar = ({ onUserSelect }) => {
  const users = useSelector((state) => state.auth.users); // Retrieve users from Redux state
  
  const selectedUser = useSelector((state) => state.auth.selectedUser); // Retrieve selectedUser from Redux state
  const [selectedSection, setSelectedSection] = useState("Home");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null); // State for UserMenu

const handleSectionClick = (section) => {
    if (section === "More") {
      return;
    }
    if (section === "DMs") {
      setSelectedSection(section);
      setMobilePanelOpen(true);
      return;
    }
    if (section === "Channel") {
      setSelectedSection(section);
      setMobilePanelOpen(true);
      return;
    }
    setSelectedSection(section);
    setMobilePanelOpen(true);
};

  const handleMoreClick = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const handleUserClick = (event) => {
    setUserAnchorEl(event.currentTarget); 
  };

  const handleUserClose = () => {
    setUserAnchorEl(null); // Close UserMenu
  };

const renderSection = () => {
  switch (selectedSection) {
      case "DMs":
        return <DMs onUserSelect={onUserSelect} />; // Render DMs component
      case "Channel":
        return <ChannelChatUI onUserSelect={onUserSelect} />;
      case "Activity":
        return <ActivityComponent />;
      default:
        return <Home onUserSelect={onUserSelect} />;
    }
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
            height: "calc(100vh - 70px)",
            marginTop: "70px",
          },
        }}
      >
        {/* Profile Avatar */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar 
            src={selectedUser && selectedUser.avatar ? selectedUser.avatar : undefined} 
            sx={{ bgcolor: selectedUser && selectedUser.avatar ? undefined : "#aaa", color: "black" }}
          >
            {!selectedUser || !selectedUser.avatar ? (selectedUser && selectedUser.name ? selectedUser.name.charAt(0) : null) : null}
          </Avatar>
        </Box>

    

      {/* Navigation Icons */}
        <List sx={{ width: "100%", marginTop: "16px" }}>
          {[
            { label: "Home", icon: <HomeOutlined /> },
            { label: "DMs", icon: <ChatBubbleOutline /> },
            { label: "Activity", icon: <NotificationsNone /> },
          ].map((item) => (
            <ListItem
              button
              key={item.label}
              sx={{
                flexDirection: "column",
                alignItems: "center",
                bgcolor: selectedSection === item.label ? "#57315a" : "transparent",
                mb: 2,
              }}
              onClick={() => handleSectionClick(item.label)}
            >
              <ListItemIcon sx={{ color: "white", minWidth: "auto", mb: 1, mr: 0.5 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ color: "white", fontSize: "0.75rem", mt: -0.5 }} />
            </ListItem>
          ))}

          {/* More Button */}
          <ListItem
            button
            sx={{ flexDirection: "column", alignItems: "center", mb: 2 }}
            onClick={handleMoreClick}
          >
            <ListItemIcon sx={{ color: "white", minWidth: "auto", mb: 0, mr: 0.5 }}>
              <MoreHoriz />
            </ListItemIcon>
            <ListItemText primary="More" sx={{ color: "white", fontSize: "0.75rem", mt: -0.5 }} />
          </ListItem>
        </List>

        {/* Bottom Icons */}
        <Box sx={{ textAlign: "center", mt: "auto", mb: 2 }}>
          <IconButton
            sx={{
              borderRadius: "50%",
              color: "white",
              p: 1,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Add fontSize="large" />
          </IconButton>
          <IconButton
            sx={{
              color: "white",
              mt: 1,
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={handleUserClick} 
          >
            <Person fontSize="large" />
          </IconButton>
        </Box>
      </Drawer>

      {/* Sub-Section Panel */}
      <Box
        sx={{
          width: 320,
          height: "100vh",
          bgcolor: "#290b2c",
          color: "white",
          position: "fixed",
          left: 72,
          padding: 2,
          transition: "all 0.3s ease-in-out",
          display: { xs: mobilePanelOpen ? "block" : "none", sm: "block" },
        }}
      >
        {renderSection()}
      </Box>

      {/* More Popup */}
      <Popover
        open={Boolean(moreAnchorEl)}
        anchorEl={moreAnchorEl}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "#290b2c",
            color: "white",
            padding: 2,
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <MoreComponent />
      </Popover>
      <UserMenu anchorEl={userAnchorEl} onClose={handleUserClose} selectedUser={selectedUser} />
    </>
  );
};

export default Sidebar;
