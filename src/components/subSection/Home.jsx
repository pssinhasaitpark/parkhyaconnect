import React, { useState, useEffect } from "react";
import { getColorFromName } from "../../utils/colorUtils";
import { fetchMessages, clearMessages } from "../../redux/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/authSlice";
import { fetchChannels } from "../../redux/channelsSlice";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { ExpandLess, ExpandMore, Add, Tag, Lock } from "@mui/icons-material";
import ChannelPopup from "../../components/ChatBox/ChannelPopup";
import ChannelChatUI from "../../components/ChatBox/ChannelChatUI"; 

const Home = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const [openSections, setOpenSections] = useState({
    channels: false,
    dms: false,
  });
  const [openChannelPopup, setOpenChannelPopup] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null); // State for the selected channel
  const { users, loading: usersLoading } = useSelector((state) => state.auth);
  const { channels, loading: channelsLoading } = useSelector((state) => state.channels);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchChannels());
  }, [dispatch]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleOpenChannelPopup = () => {
    setOpenChannelPopup(true);
  };

  const handleCloseChannelPopup = () => {
    setOpenChannelPopup(false);
  };

  const handleChannelSelect = (channelId, channelName) => {
    console.log(`Selected channel: ${channelName} (${channelId})`);
    setSelectedChannel({ id: channelId, name: channelName }); // Set the selected channel
    dispatch(fetchMessages({ channelId })); // Fetch messages for the selected channel
    dispatch(clearMessages()); // Clear previous messages
  };

  const handleUserSelect = (user) => {
    console.log(`User  clicked: ${user.id}`);
    dispatch(fetchMessages({ userId: user.id }));
    dispatch(clearMessages());
    setActiveChatUserId(user.id);
    onUserSelect(user);
    // Close the channel chat if it's open
    setSelectedChannel(null);
  };

  const handleCloseChannelChat = () => {
    setSelectedChannel(null); // Close the channel chat
  };

  return (
    <Box
      sx={{
        width: 320,
        height: "100vh",
        bgcolor: "#290B2C",
        color: "white",
        position: "fixed",
        left: 72,
        padding: 2,
      }}
    >
      <Typography variant="h6">ParkhyaConnect</Typography>
      {/* Channels Section */}
      <List>
        <ListItem button onClick={() => toggleSection('channels')}>
          <ListItemText primary="Channels" />
          {openSections.channels ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSections.channels} timeout="auto" unmountOnExit>
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}> {/* Set max height and enable scrolling */}
            <List component="div" disablePadding>
              {channelsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                </Box>
              ) : channels && channels.length > 0 ? (
                channels.map((channel, index) => (
                    <ListItem
                    button={true}
                    key={`${channel.id}-${index}`}

                    sx={{ pl: 2 }}
                    onClick={() => handleChannelSelect(channel.id, channel.name)}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Tag sx={{ color: "white", fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText primary={channel.name} />
                    {channel.isPrivate && <Lock sx={{ color: "white", fontSize: 18, ml: 1 }} />}
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
          </Box>
        </Collapse>
      </List>
      {/* Direct Messages Section */}
      <List>
        <ListItem button onClick={() => toggleSection('dms')}>
          <ListItemText primary="Direct Messages" />
          {openSections.dms ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSections.dms} timeout="auto" unmountOnExit>
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}> {/* Set max height and enable scrolling */}
            <List component="div" disablePadding>
              {usersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                </Box>
              ) : Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                    <ListItem
                    button={true}
                    key={`${user.id}-${index}`}

                    sx={{ pl: 2 }}
                    onClick={() => handleUserSelect(user)}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: getColorFromName(user.fullName) }}>
                        {user?.fullName && user?.fullName.trim() !== ""
                          ? user?.fullName[0]
                          : "?"}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={user?.fullName && user?.fullName.trim()} />
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
          </Box>
        </Collapse>
      </List>
      {/* Display selected channel's chat interface */}
      {selectedChannel && (
        <ChannelChatUI 
          open={!!selectedChannel} 
          onClose={handleCloseChannelChat} 
          channel={selectedChannel} 
        />
      )}
      <ChannelPopup open={openChannelPopup} handleClose={handleCloseChannelPopup} />
    </Box>
  );
};

export default Home;
