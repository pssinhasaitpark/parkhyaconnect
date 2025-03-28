import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Send, InfoOutlined, SearchOutlined } from "@mui/icons-material";
import { getColorFromName } from "../../utils/colorUtils";
import {
  sendChannelMessage,
  fetchChannelMessages,
} from "../../redux/channelsSlice";
import ChannelDetailsModal from "./ChannelDetailsModal";
import { io } from "socket.io-client";

const ChannelChatUI = ({ channel }) => {
  const dispatch = useDispatch();
  const [messageInput, setMessageInput] = useState("");
  const [channelDetailsOpen, setChannelDetailsOpen] = useState(false);
  const { currentChannel, loading, error } = useSelector((state) => state.channels);
  const userId = localStorage.getItem("userId");

  // Initialize socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("http://192.168.0.152:8000", {
      auth: { token },
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (newMessage) => {
      dispatch(fetchChannelMessages(channel.id));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, channel.id]);

  // Fetch messages every 5 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      if (channel?.id) {
        console.log(`Fetching messages for channel ID: ${channel.id}`);
        await dispatch(fetchChannelMessages(channel.id));
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [dispatch, channel?.id]);

  const handleSendMessage = () => {
    if (messageInput.trim() && channel?.id) {
      const messageData = {
        channelId: channel.id,
        content: messageInput.trim(),
      };
      dispatch(sendChannelMessage(messageData)).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          setMessageInput("");
        }
      });
    }
  };

  // Debugging: Log the current channel and its messages
  useEffect(() => {
    console.log("Current Channel:", currentChannel);
    console.log("Messages:", currentChannel?.messages);
  }, [currentChannel]);

  return (
    <Box
      sx={{
        width: "calc(100% - 420px)",
        height: "100%",
        bgcolor: "#2F3136",
        color: "white",
        position: "fixed",
        right: 0,
        top: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Channel Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          height: "20%",
          top: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            # {channel.name}
          </Typography>
          {channel.isPrivate && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "rgba(255,255,255,0.2)",
                px: 1,
                borderRadius: 1,
              }}
            >
              Private Channel
            </Box>
          )}
        </Box>
        <IconButton onClick={() => setChannelDetailsOpen(true)}>
          <InfoOutlined sx={{ color: "white" }} />
        </IconButton>
      </Box>

      {/* Messages List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
        }}
      >
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <List>
            {currentChannel?.messages?.map((msg) => (
              <ListItem key={msg.id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getColorFromName(msg.sender.fullName),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {msg.sender.fullName[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          mr: 1,
                        }}
                      >
                        {msg.sender.fullName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        bgcolor: msg.senderId === userId ? "blue" : "#343a40",
                        color: "white",
                        p: 1,
                        borderRadius: 1,
                        maxWidth: "70%",
                        wordWrap: "break-word",
                        alignSelf: msg.senderId === userId ? "flex-end" : "flex-start",
                      }}
                    >
                      <Typography variant="body2">
                        {msg.content || 'No content'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        {error && (
          <Typography variant="body2" color="error" sx={{ p: 2 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Message #${channel.name}`}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.1)",
              color: "white",
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,255,255,0.4)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <IconButton>
                <SearchOutlined sx={{ color: "white" }} />
              </IconButton>
            ),
            endAdornment: (
              <IconButton onClick={handleSendMessage}>
                <Send sx={{ color: "white" }} />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Channel Details Modal */}
      <ChannelDetailsModal
        open={channelDetailsOpen}
        onClose={() => setChannelDetailsOpen(false)}
        channel={channel}
      />
    </Box>
  );
};

export default ChannelChatUI;