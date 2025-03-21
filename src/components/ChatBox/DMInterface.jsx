import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, IconButton, TextField, Button, Dialog, DialogContent, Card, CardContent, CircularProgress, Divider, Link } from '@mui/material';
import { MoreVert as MoreVertIcon, Close as CloseIcon, Send as SendIcon, AccessTime, Email } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';
import { fetchMessages, sendMessage, addMessage } from '../../redux/messagesSlice';
import { fetchUserDetails } from '../../redux/authSlice'; 

// Connect to the Socket.io server
const socket = io('http://192.168.0.152:8000', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const DMInterface = ({ selectedUser }) => {
  const [isSending, setIsSending] = useState(false); 
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  
  // Fetch current user on component mount
  useEffect(() => {
    dispatch(fetchUserDetails()); // Fetch the current user
  }, [dispatch]);
  const messages = useSelector((state) => state.messages.messages);
  const loading = useSelector((state) => state.messages.loading); 
  const error = useSelector((state) => state.messages.error); 
  const [message, setMessage] = useState('');
  const [openProfile, setOpenProfile] = useState(false); 
  const messagesEndRef = useRef(null);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages({ userId: selectedUser.id }));
    }
  }, [selectedUser, dispatch]);

  // Join Socket.io room
  useEffect(() => {
    if (currentUser) {
      socket.emit('join', currentUser.id);
      console.log(`User ${currentUser.id} joined the Socket.IO room.`);
    } else {
      console.error('Current user is not authenticated. Cannot join Socket.IO room.');
    }

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    console.log('Socket connected:', socket.id);
    socket.on('receiveMessage', (newMessage) => {
        console.log('New message received:', newMessage);
        dispatch(addMessage(newMessage));
        
        // Show notification for the new message
        new Notification('New Message', {
          body: `${newMessage.content}`,
          icon: 'path/to/icon.png' // Replace with your icon path
        });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUser, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    // Prevent sending if already sending or message is empty
    if (!currentUser) {
      console.warn('Message not sent because the current user is not logged in:', { currentUser, message });
      alert("You must be logged in to send a message."); 
     
      return;
    }
    if (!message.trim() || isSending) {
      console.warn('Message not sent due to missing fields or already sending:', { currentUser, message });
      return;
    }

    const messageData = {
      receiverId: selectedUser.id,
      senderId: currentUser.id,
      content: message,
      type: 'private',
    };

    try {
      setIsSending(true); // Set sending state to true
      const token = localStorage.getItem('token');

      const response = await axios.post('http://192.168.0.152:8000/api/messages', messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Send the message via socket
      socket.emit('sendMessage', response.data);

      setMessage('');
      setIsSending(false); // Reset sending state after successful send
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      setIsSending(false); // Reset sending state on error
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) {
        handleSendMessage();
      }
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleViewProfile = () => {
    setOpenProfile(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', bgcolor: '#2F3136', color: 'white' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, mt: 5, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
            <Avatar src={selectedUser?.avatar} sx={{ marginRight: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {selectedUser?.fullName || 'Select a user'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ color: 'white', mx: 1 }}>
              <MoreVertIcon />
            </IconButton>
            <IconButton size="small" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* User Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar src={selectedUser ? selectedUser.avatar : ''} sx={{ width: 70, height: 70, bgcolor: '#F0A030', mb: 1, mt: 2 }} />
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {selectedUser ? selectedUser.fullName : 'Select a user'}
            <Box sx={{ width: 8, height: 8, bgcolor: '#36C5F0', borderRadius: '50%', ml: 1 }} />
          </Typography>
          {selectedUser && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 2 }}>
                This conversation is just between you and
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                Take a look at their profile to learn more about them.
              </Typography>
            </>
          )}
          <Box
            onClick={handleViewProfile}
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
          {messages.map((msg, index) => {
            const isCurrentUserMessage = msg.senderId === currentUser.id;
            
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 2,
                  justifyContent: isCurrentUserMessage ? 'flex-end' : 'flex-start',
                }}
              >
                {!isCurrentUserMessage && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mr: 2 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} src={selectedUser?.avatar} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {selectedUser?.fullName}
                    </Typography>
                  </Box>
                )}
                <Box
                  sx={{
                    bgcolor: isCurrentUserMessage ? '#3F4247' : '#1E1E1E',
                    borderRadius: '8px',
                    p: 1.5,
                    maxWidth: '70%',
                    alignSelf: isCurrentUserMessage ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {typeof msg.content === 'string' ? msg.content : msg.content?.data?.content || 'No content'}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input Form */}
        <form style={{ display: 'flex', alignItems: 'center', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
          <TextField
            multiline
            placeholder={`Message ${selectedUser?.fullName || ''}`}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown} 
            sx={{
              '& .MuiOutlinedInput-root': { padding: 1.5, color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
            inputProps={{ style: { color: 'white' } }}
          />
          <Button type="button" variant="contained" color="primary" sx={{ ml: 1 }} disabled={isSending} onClick={handleSendMessage}>
            <SendIcon />
          </Button>
        </form>
      </Box>

      {/* Profile Dialog */}
      <Dialog
        open={openProfile}
        onClose={handleCloseProfile}
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
                src={selectedUser?.avatar || ''}
                alt={selectedUser?.fullName || 'User Avatar'}
              />

              {/* User Name */}
              <Typography variant="h6">
                {selectedUser?.fullName || 'User Name'}
              </Typography>

              {/* Action Buttons */}
              <Button
                variant="outlined"
                size="small"
                sx={{ m: 1, color: "white", borderColor: "gray" }}
              >
                Mute
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ m: 1, color: "white", borderColor: "gray" }}
              >
                Hide
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{ m: 1, color: "white", borderColor: "gray" }}
              >
                Huddle
              </Button>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Topic */}
              <Typography variant="subtitle2">Topic</Typography>
              <Typography variant="body2" color="gray">
                {selectedUser?.topic || 'Add a topic'}
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
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Email fontSize="small" sx={{ mr: 1 }} />
                <Link
                  href={`mailto:${selectedUser?.email}`}
                  color="#4fc3f7"
                  underline="hover"
                >
                  {selectedUser?.email || 'user@example.com'}
                </Link>
              </Typography>

              {/* Full Profile Link */}
              <Typography
                variant="body2"
                color="#4fc3f7"
                sx={{ mt: 1, cursor: "pointer" }}
              >
                View full profile
              </Typography>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Add people to the conversation */}
              <Typography variant="subtitle2">Add people to this conversation</Typography>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Files Section */}
              <Typography variant="subtitle2">Files</Typography>
              <Typography variant="body2" color="gray">
                There aren’t any files to see here right now. But there could be – drag
                and drop any file into the message pane to add it to this conversation.
              </Typography>

              <Divider sx={{ my: 2, bgcolor: "gray" }} />

              {/* Channel ID */}
              <Typography variant="body2" color="gray">
                Channel ID: {selectedUser?.channelId || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DMInterface;