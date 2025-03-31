import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Badge,
  Tooltip,
  Chip,
  AvatarGroup,
} from "@mui/material";
import {
  Send,
  InfoOutlined,
  SearchOutlined,
  CheckCircle as CheckCircleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from "@mui/icons-material";
import { getColorFromName } from "../../utils/colorUtils";
import {
  sendChannelMessage,
  fetchChannelMessages,
  fetchChannelDetails,
  addMemberToChannel,
} from "../../redux/channelsSlice";
import ChannelDetailsModal from "./ChannelDetailsModal";
import { io } from "socket.io-client";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { markMessageAsSeen } from "../../redux/messagesSlice";

const MessageItem = React.memo(({ msg, isCurrentUser , formatDate, formatTime, normalizeMessage, renderSeenStatus }) => {
  return (
    <ListItem
      key={msg.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isCurrentUser  ? "flex-end" : "flex-start",
        py: 1,
      }}
    >
      <Box sx={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        justifyContent: isCurrentUser  ? "flex-end" : "flex-start"
      }}>
        {!isCurrentUser  && (
          <Avatar
            sx={{
              bgcolor: getColorFromName(msg.sender?.fullName || "User       "),
              width: 30,
              height: 30,
              mr: 1,
            }}
          >
            {(msg.sender?.fullName || "U")[0]}
          </Avatar>
        )}

        <Box sx={{ maxWidth: '70%' }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "white",
                fontWeight: "bold",
                mr: 1,
              }}
            >
              {isCurrentUser  ? "You" : msg.sender?.fullName || "Unknown User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.6)" }}
            >
              {formatDate(msg.created_at)} {formatTime(msg.created_at)}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: isCurrentUser  ? "#4F74DD" : "#424549",
              color: "white",
              p: 1.5,
              borderRadius: "8px",
              boxShadow: 1,
              wordBreak: "break-word"
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'Roboto, sans-serif'
                }}
              >
                {normalizeMessage(msg)}
                {msg.edited && (
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', ml: 1 }}>
                    (edited)
                  </Typography>
                )}
              </Typography>
            </pre>

            <Box sx={{ display: 'flex', justifyContent: isCurrentUser  ? 'flex-end' : 'flex-start', alignItems: 'center', mt: 0.5 }}>
              {renderSeenStatus(msg)}
              {/* Render avatars of users who have seen the message */}
              {msg.seenBy && msg.seenBy.length > 0 && (
                <Box sx={{ display: 'flex', ml: 1 }}>
                  {msg.seenBy.map((user) => (
                    <Tooltip key={user.id} title={user.fullName || user.username || 'Unknown'}>
                      <Avatar
                        sx={{
                          bgcolor: getColorFromName(user.fullName || 'User       '),
                          width: 20,
                          height: 20,
                          ml: -0.5,
                        }}
                      >
                        {(user.fullName || 'U')[0]}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {isCurrentUser  && (
          <Avatar
            sx={{
              bgcolor: getColorFromName(msg.sender?.fullName || "User       "),
              width: 30,
              height: 30,
              ml: 1,
            }}
          >
            {(msg.sender?.fullName || "U")[0]}
          </Avatar>
        )}
      </Box>
    </ListItem>
  );
});

const ChannelChatUI = ({ channel }) => {
  const dispatch = useDispatch();
  const [messageInput, setMessageInput] = useState("");
  const [channelDetailsOpen, setChannelDetailsOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const { currentChannel, loading, error, availableUsers } = useSelector((state) => state.channels);
  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [localLoading, setLocalLoading] = useState(false); // Local loading state

  // Initialize socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://192.168.0.152:8000", {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setSocketConnected(true);

      // Join channel room
      if (channel?.id) {
        newSocket.emit('joinChannel', { channelId: channel.id });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    // Listen for incoming messages
    newSocket.on("receiveMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      // Append the new message to the existing messages
      dispatch({
        type: 'channels/addMessage',
        payload: newMessage,
      });

      // Mark the message as seen for the sender
      if (newMessage.senderId !== userId) {
        dispatch(markMessageAsSeen(newMessage.id));
      }
    });

    // Listen for member updates
    newSocket.on("memberJoined", (data) => {
      console.log("Member joined:", data);
      dispatch(fetchChannelDetails(channel.id));
      toast.info(`${data.userName} joined the channel`);
    });

    return () => {
      if (channel?.id) {
        newSocket.emit('leaveChannel', { channelId: channel.id });
      }
      newSocket.disconnect();
    };
  }, [dispatch, channel?.id]);

  // Fetch channel details and messages when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (channel?.id) {
        setLocalLoading(true); // Start local loading
        console.log(`Fetching details for channel ID: ${channel.id}`);
        await dispatch(fetchChannelDetails(channel.id));
        console.log(`Fetching messages for channel ID: ${channel.id}`);
        const previousMessages = currentChannel?.messages || []; // Preserve existing messages
        await dispatch(fetchChannelMessages(channel.id));
        // Update the messages state with the new messages
        dispatch({
          type: 'channels/updateMessages', // Assuming you have an action to update messages
          payload: previousMessages, // Keep existing messages
        });
        setLocalLoading(false); // End local loading
      }
    };

    fetchData();

    // Keep the interval for real-time updates
    const interval = setInterval(() => {
      if (channel?.id) {
        setLocalLoading(true); // Start local loading
        const previousMessages = currentChannel?.messages || []; // Preserve existing messages
        dispatch(fetchChannelMessages(channel.id)).then(() => {
          // Update the messages state with the new messages
          dispatch({
            type: 'channels/updateMessages', // Assuming you have an action to update messages
            payload: previousMessages, // Keep existing messages
          });
          setLocalLoading(false); // End local loading
        });
      }
    }, 5000);

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
          // Mark the sent message as seen
          const sentMessageId = response.payload.id; // Assuming the response contains the message ID
          dispatch(markMessageAsSeen(sentMessageId));
        } else {
          toast.error("Failed to send message. Please try again.");
        }
      });
    }
  };

  const handleAddMember = (memberId) => {
    // Check if the user is already a member
    const isAlreadyMember = currentChannel?.members?.some(member => member.id === memberId);

    if (isAlreadyMember) {
      toast.warning("This user is already a member of the channel");
      return;
    }

    dispatch(addMemberToChannel({ channelId: channel.id, userId: memberId }))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success("Member added successfully");
          dispatch(fetchChannelDetails(channel.id));
        } else {
          toast.error("Failed to add member. Please try again.");
        }
      });
  };

  // Format time for message timestamp
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to normalize message content
  const normalizeMessage = (msg) => {
    if (!msg) return 'No content';

    if (typeof msg === 'string') return msg;

    if (typeof msg.content === 'string') return msg.content;

    if (typeof msg.content === 'object') {
      if (msg.content?.data?.content) return msg.content.data.content;
      if (msg.content?.content) return msg.content.content;
    }

    // If we reach here, try JSON stringify as a last resort
    try {
      if (typeof msg.content === 'object') {
        return JSON.stringify(msg.content);
      }
    } catch (e) {
      console.error("Failed to stringify message content", e);
    }

    return 'Content format not recognized';
  };

  // Render seen status for messages
  const renderSeenStatus = (message) => {
    const isMessageSeen = message.seen;

    if (message.senderId === userId) {
      return isMessageSeen ? (
        <Tooltip title="Seen">
          <CheckCircleIcon fontSize="small" sx={{ color: '#36C5F0', ml: 0.5 }} />
        </Tooltip>
      ) : (
        <Tooltip title="Delivered">
          <CheckCircleOutlineIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.5 }} />
        </Tooltip>
      );
    }
    return null;
  };

  // Effect to maintain scroll position
  useEffect(() => {
    if (messagesContainerRef.current) {
      const isAtBottom = messagesContainerRef.current.scrollHeight - messagesContainerRef.current.scrollTop === messagesContainerRef.current.clientHeight;
      if (isAtBottom) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }
  }, [currentChannel?.messages]); // Run when messages change

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
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Channel Header - Fixed */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 10,
          height: "20px",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            # {channel.name}
          </Typography>
          {channel.isPrivate && (
            <Chip
              label="Private Channel"
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 2 }}
            />
          )}

          {/* Channel Members */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mr: 1 }}>
              Members:
            </Typography>
            <AvatarGroup
              max={4}
              sx={{
                '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' }
              }}
            >
              {currentChannel?.members?.map((member) => (
                <Tooltip key={member.id} title={member.fullName || member.username || 'Unknown'}>
                  <Avatar
                    sx={{
                      bgcolor: getColorFromName(member.fullName || 'User       ')
                    }}
                  >
                    {(member.fullName || 'U')[0]}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>

            <Tooltip title="Add Member">
              <IconButton
                size="small"
                sx={{ ml: 1, color: 'rgba(255,255,255,0.7)' }}
                onClick={() => setAddMemberOpen(true)}
              >
                {/* <PersonAdd fontSize="small" /> */}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            variant="dot"
            color={socketConnected ? "success" : "error"}
            sx={{ mx: 1 }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {socketConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Badge>
          <IconButton onClick={() => setChannelDetailsOpen(true)}>
            <InfoOutlined sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Box>

      {/* Messages List */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "#36393F",
          mt: 2,
        }}
      >
        <List>
          {currentChannel?.messages && currentChannel.messages.length > 0 ? (
            currentChannel.messages.map((msg) => {
              const isCurrentUser  = msg.senderId === userId;
              const isSystemMessage = msg.content && typeof msg.content === 'string' && msg.content.includes("has joined the channel");

              if (isSystemMessage) {
                return (
                  <Box
                    key={msg.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      my: 1,
                      p: 1,
                      bgcolor: 'rgba(114, 137, 218, 0.1)',
                      borderRadius: 1
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.6)",
                        fontStyle: "italic",
                      }}
                    >
                      {msg.sender?.fullName} {normalizeMessage(msg)}
                    </Typography>
                  </Box>
                );
              }

              return (
                <MessageItem
                  key={msg.id}
                  msg={msg}
                  isCurrentUser ={isCurrentUser }
                  formatDate={formatDate}
                  formatTime={formatTime}
                  normalizeMessage={normalizeMessage}
                  renderSeenStatus={renderSeenStatus}
                />
              );
            })
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", color: "rgba(255,255,255,0.6)", p: 4 }}>
              No messages yet. Start the conversation!
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </List>

        {error && (
          <Box sx={{
            bgcolor: 'rgba(255,0,0,0.1)',
            color: '#ff6b6b',
            p: 2,
            borderRadius: 1,
            mt: 2
          }}>
            <Typography variant="body2">
              Error: {error}
            </Typography>
          </Box>
        )}

        {/* Connection status indicator */}
        {!socketConnected && (
          <Box sx={{
            bgcolor: 'rgba(255,0,0,0.1)',
            color: '#ff6b6b',
            p: 1,
            borderRadius: 1,
            textAlign: 'center',
            mt: 1
          }}>
            <Typography variant="body2">
              Connection lost. Reconnecting...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderTop: '1px solid rgba(255,255,255,0.1)',
          bgcolor: "#2F3136"
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Message #${channel.name}`}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          multiline
          maxRows={3}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.1)",
              color: "white",
              padding: 1.5,
              overflow: 'auto',
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,255,255,0.4)",
              },
            },
            "& textarea": {
              resize: "none",
              maxHeight: "100px",
              overflow: "auto",
            },
          }}
          InputProps={{
            startAdornment: (
              <IconButton>
                <SearchOutlined sx={{ color: "white" }} />
              </IconButton>
            ),
            endAdornment: (
              <IconButton
                onClick={handleSendMessage}
                disabled={!socketConnected || !messageInput.trim()}
              >
                <Send sx={{ color: socketConnected && messageInput.trim() ? "white" : "gray" }} />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Channel Details Modal */}
      <ChannelDetailsModal
        open={channelDetailsOpen}
        onClose={() => setChannelDetailsOpen(false)}
        channel={currentChannel || channel}
        onAddMember={handleAddMember}
      />
    </Box>
  );
};

export default ChannelChatUI;