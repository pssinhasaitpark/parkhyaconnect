import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  CircularProgress,
  Badge,
  Tooltip,
  Snackbar,
  Alert,
  ThemeProvider,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  RecordVoiceOver as VoiceIcon,
} from '@mui/icons-material';
import { addMessage, fetchMessages, sendMessage } from '../../redux/messagesSlice';

const Header = ({ user, isOnline, isTyping, error }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2,
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      bgcolor: '#1E1E1E',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color={isOnline ? 'success' : 'error'}
      >
        <Avatar src={user?.avatar || undefined} sx={{ bgcolor: 'blue' }}>
          {user?.fullName?.charAt(0) || '?'}
        </Avatar>
      </Badge>
      <Box sx={{ ml: 2 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          {error ? (
            <Typography sx={{ color: 'red' }}>{error}</Typography>
          ) : (
            user?.fullName || 'Unknown User'
          )}
        </Typography>
        {isTyping && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            typing...
          </Typography>
        )}
      </Box>
    </Box>
  </Box>
);


const MessageInput = ({ message, setMessage, handleSendMessage }) => (
  <Box
    sx={{
      p: 2,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Tooltip title="Attach File">
      <IconButton>
        <AttachFileIcon sx={{ color: 'white' }} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Add Emoji">
      <IconButton>
        <EmojiIcon sx={{ color: 'white' }} />
      </IconButton>
    </Tooltip>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Type a message..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      }}
      multiline
      maxRows={4}
      sx={{
        mx: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
      }}
      InputProps={{
        sx: {
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255,255,255,0.5)',
          },
        },
      }}
    />
    <Tooltip title="Voice Message">
      <IconButton>
        <VoiceIcon sx={{ color: 'white' }} />
      </IconButton>
    </Tooltip>
    <Tooltip title="Send Message">
      <IconButton
        onClick={handleSendMessage}
        disabled={!message.trim()}
        sx={{
          backgroundColor: message.trim() ? 'rgba(74, 21, 75, 0.6)' : 'transparent',
          '&:hover': {
            backgroundColor: message.trim() ? 'rgba(74, 21, 75, 0.8)' : 'transparent',
          },
        }}
      >
        <SendIcon color={message.trim() ? 'secondary' : 'disabled'} />
      </IconButton>
    </Tooltip>
  </Box>
);

const MessageList = ({ messages, currentUser }) => {
  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return messageDate.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        backgroundColor: '#2C2C2C',
      }}
    >
      {messages.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            mt: 4,
          }}
        >
          No messages yet. Start a conversation!
        </Typography>
      ) : (
        messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUser.id;
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                mb: 2,
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
              }}
            >
              {!isCurrentUser && (
                <Avatar sx={{ mr: 2, bgcolor: 'blue' }}>
                  {msg.senderName?.charAt(0) || '?'}
                </Avatar>
              )}
              <Box
                sx={{
                  backgroundColor: isCurrentUser ? '#1164A3' : '#2C2C2C',
                  borderRadius: '8px',
                  p: 1.5,
                  maxWidth: '70%',
                  position: 'relative',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 0.5 }}>
                  {msg.senderName || 'Unknown User'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', wordBreak: 'break-word' }}>
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    display: 'block',
                    textAlign: 'right',
                    mt: 0.5,
                  }}
                >
                  {formatMessageTime(msg.timestamp)}
                </Typography>
              </Box>
              {isCurrentUser && (
                <Avatar sx={{ ml: 2, bgcolor: 'green' }}>
                  {msg.senderName?.charAt(0) || '?'}
                </Avatar>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

const UserChatUI = ({ id, selectedUser, selectedChannel }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.messages.messages);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  const recipientData = selectedUser || selectedChannel;

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://192.168.0.152:8000');
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      setIsOnline(true);
      showNotification('Connected to chat server', 'success');
    });

    socket.on('disconnect', () => {
      setIsOnline(false);
      showNotification('Disconnected from chat server', 'error');
    });

    socket.on('receive_message', (incomingMessage) => {
      dispatch(addMessage(incomingMessage));
      if (document.hidden) {
        const senderName = incomingMessage.senderName || 'Someone';
        new Notification(`New message from ${senderName}`, {
          body: incomingMessage.text,
        });
      }
    });

    socket.on('user_typing', (data) => {
      if (data.senderId === selectedUser?.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    socket.on('connect_error', (error) => {
      showNotification('Connection error. Trying to reconnect...', 'error');
    });

    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [socket, selectedUser]);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSendMessage = async () => {
    console.log("Sending message:", message, "from user:", currentUser);
    const userId = currentUser.id;
    const userName = currentUser.fullName || currentUser.name || 'Unknown User';
    const receiverId = recipientData.id;
    const receiverName = recipientData.fullName || recipientData.name || 'Unknown Recipient';

    const newMessage = {
      senderName: userName,
      receiverName: receiverName,
      text: message,
      senderId: userId,
      isChannel: !!selectedChannel,
    };

    try {
      await fetch('http://192.168.0.152:8000/api/messages', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message, receiverId }),
      });
      if (!recipientData) { 
        showNotification('Please select a user or channel to chat with.', 'warning');
        return;
      }
      
      if (message.trim() && socket) {
        socket.emit('send_message', newMessage);
        dispatch(addMessage(newMessage));
        setMessage('');
        showNotification('Message sent successfully!', 'success');
      }
    } catch (error) {
      showNotification('Error sending message. Please try again.', 'error');
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (socket && selectedUser) {
      socket.emit('user_typing', {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
      });
    }
  };

  return (
    <ThemeProvider theme={{}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '77vw',
          backgroundColor: '#2C2C2C',
        }}
      >
        <Header user={selectedUser?.data || selectedUser} isOnline={isOnline} isTyping={isTyping} error="" />
   
        
        <MessageList messages={messages} currentUser={currentUser} user={currentUser} />
        <MessageInput message={message} setMessage={setMessage} handleSendMessage={handleSendMessage} />
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default UserChatUI;
