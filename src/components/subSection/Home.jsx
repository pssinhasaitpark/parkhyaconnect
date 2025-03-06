import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/authSlice"; // Assuming you have a fetchUsers action
import { fetchChannels } from "../../redux/channelsSlice"; // Import fetchChannels action
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
} from "@mui/material";
import { ExpandLess, ExpandMore, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ChannelPopup from "../../components/ChatBox/ChannelPopup"; // Importing ChannelPopup

const Home = ({ onUserSelect }) => {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  const [openChannelPopup, setOpenChannelPopup] = useState(false); // State for channel popup

  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.auth); // Default users as empty array

  useEffect(() => {
    dispatch(fetchUsers()); // Fetch users on component mount
    dispatch(fetchChannels()); // Fetch channels on component mount
  }, [dispatch]);

  const channels = useSelector((state) => state.channels.channels); // Get channels from Redux state

  const handleOpenChannelPopup = () => {
    setOpenChannelPopup(true);
  };

  const handleCloseChannelPopup = () => {
    setOpenChannelPopup(false);
  };

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
            {channels.length > 0 ? (
              channels.map((channel) => (
                <ListItem button key={channel} sx={{ pl: 2 }}>
                  <ListItemText primary={`# ${channel}`} />
                </ListItem>
              ))
            ) : (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
                No channels available.
              </Typography>
            )}
            <ListItem button sx={{ pl: 2 }} onClick={handleOpenChannelPopup}>
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
            {/* Loading State */}
            {loading ? (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
                Loading users...
              </Typography>
            ) : Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <ListItem
                  button
                  key={user.id}
                  sx={{ pl: 2 }}
                  onClick={() => {
                    if (user.fullName === "Rajhveer Joshi") {
                      window.location.href = `/chat/rajhveer-joshi`;
                    } else {
                      onUserSelect(user);
                    }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {user.fullName && user.fullName.trim() !== ""
                        ? user.fullName[0]
                        : "?"}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={user.fullName && user.fullName.trim()} />
                  {user.isOnline && (
                    <Box
                      sx={{
                        bgcolor: "green",
                        borderRadius: "50%",
                        width: 10,
                        height: 10,
                        position: "absolute",
                        right: 10,
                        top: 10,
                      }}
                    />
                  )}
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
              ))
            ) : (
              <Typography sx={{ color: "#ccc", textAlign: "center", mt: 2 }}>
                No users found.
              </Typography>
            )}
            <ListItem button sx={{ pl: 2 }}>
              <ListItemIcon>
                <Add sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Add Colleagues" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      {/* Channel Creation Popup */}
      <ChannelPopup open={openChannelPopup} handleClose={handleCloseChannelPopup} />
    </Box>
  );
};

export default Home;
