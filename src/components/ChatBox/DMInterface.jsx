import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Link,
  Card,
  CardContent,
  CircularProgress,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  Send as SendIcon,
  AccessTime,
  Email,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
  fetchMessages,
  addMessage,
  markAllMessagesSeen,
  setSocketConnected,
  deleteMessage,
  markMessageAsSeen,
  updateMessageThunk,
} from '../../redux/messagesSlice';
import { fetchUserDetails } from '../../redux/authSlice';

let socket;

const initializeSocket = (url, token) => {
  if (!socket || !socket.connected) {
    if (socket) {
      socket.close();
    }

    socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: { token },
      query: { token },
    });

    console.log('Socket initialized with new connection');
  }
  return socket;
};

const DMInterface = ({ selectedUser  , onClose }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMessageId, setEditMessageId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const dispatch = useDispatch();
  const currentUser  = useSelector((state) => state.auth.currentUser );
  const messagesFromRedux = useSelector((state) => state.messages.messages) || [];
  const loading = useSelector((state) => state.messages.loading);
  const error = useSelector((state) => state.messages.error);
  const socketConnected = useSelector((state) => state.messages.socketConnected);

  const messagesEndRef = useRef(null);
  const lastMessageRef = useRef(null); // Ref for the last message

  const allMessages = useMemo(() => {
    return [...messagesFromRedux].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [messagesFromRedux]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socketInstance = initializeSocket('http://192.168.0.152:8000', token);

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      dispatch(setSocketConnected(true));
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      dispatch(setSocketConnected(false));
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      dispatch(setSocketConnected(false));
    });

    socketInstance.on('messageUpdated', (updatedMessage) => {
      console.log('Message updated via socket:', updatedMessage);
      dispatch(addMessage(updatedMessage));
    });

    socketInstance.on('messageDeleted', (messageId) => {
      console.log('Message deleted via socket:', messageId);
      dispatch(deleteMessage(messageId));
    });

    socketInstance.on('receiveMessage', (newMessage) => {
      console.log('New message received via socket:', newMessage);
      dispatch(addMessage(newMessage));

      // Increment unread count if the chat is not open
      if (!isChatOpen) {
        setUnreadMessages((prevCount) => prevCount + 1);
        console.log('Unread messages incremented:', unreadMessages + 1); // Debug log
      }
    });

    return () => {
      socketInstance.disconnect();
      console.log('Socket disconnected on component unmount');
    };
  }, [dispatch, isChatOpen]);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser  && currentUser ) {
      dispatch(fetchMessages({ userId: selectedUser .id }));
    }
  }, [selectedUser , currentUser , dispatch]);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadMessages(0); // Reset unread messages count when chat is opened
      console.log('Chat opened, unread messages reset to 0'); // Debug log
    }
  }, [isChatOpen]);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  const normalizeMessage = (msg) => {
    if (typeof msg === 'string') return msg;
    if (typeof msg.content === 'string') return msg.content;
    if (msg.content?.data?.content) return msg.content.data.content;
    return 'No content';
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const renderSeenStatus = (message) => {
    const isMessageSeen = message.seen;

    if (message.senderId === currentUser .id) {
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

  const handleSendMessage = useCallback(async () => {
    if (!currentUser ) {
      alert('You must be logged in to send a message.');
      return;
    }

    if (!message.trim() || isSending) return;

    const messageData = {
      receiverId: selectedUser .id,
      senderId: currentUser .id,
      content: message,
      type: 'private',
      created_at: new Date().toISOString(),
      seen: false,
      edited: false,
    };

    dispatch(addMessage(messageData));

    try {
      setIsSending(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('http://192.168.0.152:8000/api/messages', messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.content) {
        dispatch(addMessage({ ...response.data, id: response.data.id }));
        if (socket && socket.connected) {
          socket.emit('sendMessage', response.data);
        }
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  }, [currentUser , message, isSending, selectedUser , dispatch]);

  const handleEditMessage = useCallback(async () => {
    if (!editMessageId || !message.trim()) return;

    try {
      setIsSending(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://192.168.0.152:8000/api/messages/${editMessageId}`, {
        content: message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        dispatch(updateMessageThunk({
          messageId: editMessageId,
          content: message
        }));
        if (socket && socket.connected) {
          socket.emit('updateMessage', response.data);
        }
      }

      setMessage('');
      setIsEditing(false);
      setEditMessageId(null);
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message. Please try again later.');
    } finally {
      setIsSending(false);
    }
  }, [editMessageId, message, dispatch]);

  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://192.168.0.152:8000/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(deleteMessage(messageId));
      if (socket && socket.connected) {
        socket.emit('deleteMessage', messageId);
      }

      setMessage('');
      handleCloseEditMenu();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again later.');
    }
  }, [dispatch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isEditing) {
        handleEditMessage();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleOpenEditMenu = (event, messageId, messageContent) => {
    setAnchorEl(event.currentTarget);
    setEditMessageId(messageId);
    setMessage(messageContent);
    setIsEditing(true);
  };

  const handleCloseEditMenu = () => {
    setAnchorEl(null);
    setIsEditing(false);
    setEditMessageId(null);
    setMessage('');
  };

  const handleSeenMessages = useCallback((messageId) => {
    if (messageId && currentUser  && selectedUser  && messageId !== currentUser .id) {
      console.log(`Marking message ${messageId} as seen`);
      dispatch(markMessageAsSeen(messageId));
    }
  }, [dispatch, currentUser , selectedUser ]);

  const handleClearNotifications = () => {
    if (selectedUser ) {
      setUnreadMessages(0);
      dispatch(markAllMessagesSeen(selectedUser .id));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedUser  && currentUser ) {
        dispatch(fetchMessages({ userId: selectedUser .id }));
      }
    }, 10000); // Fetch messages every 10 seconds

    return () => clearInterval(interval);
  }, [selectedUser , currentUser , dispatch]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', bgcolor: '#2F3136', color: 'white' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={selectedUser ?.avatar} sx={{ marginRight: 1 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {selectedUser ?.fullName || 'Select a user'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {socketConnected ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ color: 'white', mx: 1 }} onClick={handleClearNotifications}>
              <Badge badgeContent={unreadMessages} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="small" sx={{ color: 'white', mx: 1 }}>
              <MoreVertIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white' }} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* User Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar src={selectedUser  ? selectedUser .avatar : ''} sx={{ width: 70, height: 70, bgcolor: '#F0A030', mb: 1, mt: 2 }} />
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {selectedUser  ? selectedUser .fullName : 'Select a user'}
            <Box sx={{
              width: 8,
              height: 8,
              bgcolor: socketConnected ? '#36C5F0' : '#ccc',
              borderRadius: '50%',
              ml: 1
            }} />
          </Typography>
          {selectedUser  && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                This conversation is just between you and {selectedUser .fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                Take a look at their profile to learn more about them.
              </Typography>
            </>
          )}
          <Box
            onClick={() => setOpenProfile(true)}
            sx={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 1,
              px: 2,
              py: 1,
              mt: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            <Typography variant="body2">View profile</Typography>
          </Box>
        </Box>

        {/* Chat Messages */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 2 }}>
          {loading && <CircularProgress color="inherit" />}
          {error && <Typography color="error">{error}</Typography>}

          {/* Display messages */}
          {allMessages.map((msg, index) => (
            <Box
              key={msg.id || index}
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                mb: 2,
                justifyContent: msg.senderId === currentUser .id ? 'flex-end' : 'flex-start',
              }}
              onClick={() => {
                if (msg.senderId !== currentUser .id) {
                  handleSeenMessages(msg.id);
                }
              }}
            >
              {msg.senderId === currentUser .id ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                    <Avatar sx={{ width: 30, height: 30, mr: 1 }} src={currentUser .avatar} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>
                      You
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      alignSelf: 'flex-end',
                      boxShadow: 1,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace' }}>
                      {normalizeMessage(msg)}
                      {msg.edited && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                          (edited)
                        </Typography>
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                        {formatDate(msg.created_at)}
                      </Typography>
                      {renderSeenStatus(msg)}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditMenu(e, msg.id, normalizeMessage(msg));
                        }}
                        sx={{ color: 'white', ml: 1 }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                    <Avatar sx={{ width: 30, height: 30, mr: 1 }} src={selectedUser ?.avatar} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>
                      {selectedUser ?.fullName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      alignSelf: 'flex-start',
                      boxShadow: 1,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace' }}>
                      {normalizeMessage(msg)}
                      {msg.edited && (
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                          (edited)
                        </Typography>
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
                        {formatDate(msg.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />

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

        {/* Message Input Form */}
        <form
          style={{ display: 'flex', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.3)' }}
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditing) {
              handleEditMessage();
            } else {
              handleSendMessage();
            }
          }}
        >
          <TextField
            multiline
            placeholder={`Message ${selectedUser ?.fullName || ''}`}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              '& .MuiOutlinedInput-root': { 
                padding: 1.5, 
                color: 'white',
                overflow: 'auto', // Allow scrolling
              },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& textarea': { 
                resize: 'none', // Prevent resizing
                maxHeight: '100px', // Set max height
                overflow: 'auto', // Show scrollbar when needed
              },
            }}
            inputProps={{ style: { color: 'white' } }}
            disabled={!socketConnected}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
            disabled={isSending || !socketConnected}
          >
            {isEditing ? 'Update' : (isSending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />)}
          </Button>
        </form>
      </Box>

      {/* Menu for message options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseEditMenu}
      >
        <MenuItem onClick={() => {
          handleCloseEditMenu();
          handleEditMessage();
        }}>Edit</MenuItem>
        <MenuItem onClick={() => {
          handleDeleteMessage(editMessageId);
          handleCloseEditMenu();
        }}>Delete</MenuItem>
      </Menu>

      {/* Profile Dialog */}
      <Dialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        sx={{
          '& .MuiDialogContent-root': {
            backgroundColor: '#1a1d21'
          },
          '& .MuiDialogActions-root': {
            backgroundColor: '#1a1d21'
          }
        }}
      >
        <DialogContent>
          <Card
            sx={{
              maxWidth: 400,
              bgcolor: "#1a1d21",
              color: "white",
              p: 2,
              borderRadius: 2,
              boxShadow: 0
            }}
          >
            <CardContent>
              {/* Profile Avatar */}
              <Avatar
                sx={{ width: 56, height: 56, bgcolor: "gray", mb: 2 }}
                src={selectedUser ?.avatar || ''}
                alt={selectedUser ?.fullName || 'User  Avatar'}
              />

              {/* User Name with Online Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {selectedUser ?.fullName || 'User  Name'}
                </Typography>
                <Box sx={{
                  width: 8,
                  height: 8,
                  bgcolor: socketConnected ? '#36C5F0' : '#ccc',
                  borderRadius: '50%',
                  ml: 1
                }} />
              </Box>

              {/* Action Buttons */}
              <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>
                Mute
              </Button>
              <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>
                Hide
              </Button>
              <Button variant="outlined" size="small" sx={{ m: 1, color: "white", borderColor: "gray" }}>
                Huddle
              </Button>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Topic */}
              <Typography variant="subtitle2">Topic</Typography>
              <Typography variant="body2" color="gray">
                {selectedUser ?.topic || 'Add a topic'}
              </Typography>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Local Time */}
              <Typography variant="body2" display="flex" alignItems="center">
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}{' '}
                local time
              </Typography>

              {/* User Email */}
              <Typography variant="body2" display="flex" alignItems="center" sx={{ mt: 1 }}>
                <Email fontSize="small" sx={{ mr: 1 }} />
                <Link href={`mailto:${selectedUser ?.email}`} color="#4fc3f7" underline="hover">
                  {selectedUser ?.email || 'user@example.com'}
                </Link>
              </Typography>

              {/* Full Profile Link */}
              <Typography variant="body2" color="#4fc3f7" sx={{ mt: 1, cursor: "pointer" }}>
                View full profile
              </Typography>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Add people to the conversation */}
              <Typography variant="subtitle2">Add people to this conversation</Typography>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Files Section */}
              <Typography variant="subtitle2">Files</Typography>
              <Typography variant="body2" color="gray">
                There aren't any files to see here right now. But there could be – drag
                and drop any file into the message pane to add it to this conversation.
              </Typography>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Connection Status */}
              <Typography variant="body2" color={socketConnected ? "#36C5F0" : "gray"}>
                {socketConnected ? "Currently Online" : "Currently Offline"}
              </Typography>

              {/* Channel ID */}
              <Typography variant="body2" color="gray" sx={{ mt: 1 }}>
                Channel ID: {selectedUser ?.channelId || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DMInterface;