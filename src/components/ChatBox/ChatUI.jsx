import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Badge,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  RecordVoiceOver as VoiceIcon,
  MoreVert as MoreVertIcon,
  Videocam as VideocamIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { addMessage, fetchMessages, sendMessage } from '../../redux/messagesSlice';
import { fetchSelectedUser } from '../../redux/authSlice'; // Correct import

// Create a custom theme with dark mode
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4A154B', // Slack purple
    },
    secondary: {
      main: '#36C5F0', // Slack blue
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#2C2C2C',
            borderRadius: '8px'
          }
        }
      }
    }
  }
});

const Header = ({ user, isOnline, isTyping, error }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 2,
      borderBottom: '1px solid rgba(255,255,255,0.12)'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        color={isOnline ? "success" : "error"}
      >
        <Avatar
          src={user?.avatar || '/path/to/default/avatar.png'}
          sx={{ mr: 2, bgcolor: 'orange' }}
        >
          {user?.fullName?.charAt(0) || '?'}
        </Avatar>
      </Badge>
      <Box>
        <Typography variant="h6" sx={{ color: 'white' }}>
          {error ? (
            <Typography sx={{ color: 'red' }}>{error}</Typography>
          ) : (
            user ? (user.fullName || user.name || 'Unknown User') : 
              (user === null ? 'No user selected' : <CircularProgress color="inherit" size={20} />)
          )}
        </Typography>
        {isTyping && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            typing...
          </Typography>
        )}
      </Box>
    </Box>
    <Box>
      <Tooltip title="More Options">
        <IconButton sx={{ color: 'white' }}>
          <PhoneIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Video Call">
        <IconButton sx={{ color: 'white' }}>
          <VideocamIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="More Options">
        <IconButton sx={{ color: 'white' }}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
);

const MessageInput = ({ message, setMessage, handleSendMessage }) => (
  <Box
    sx={{
      p: 2,
      borderTop: '1px solid rgba(255,255,255,0.12)',
      display: 'flex',
      alignItems: 'center'
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
          borderRadius: '8px'
        }
      }}
      InputProps={{
        sx: {
          color: 'white',
          '&::placeholder': {
            color: 'rgba(255,255,255,0.5)'
          }
        }
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
          }
        }}
      >
        <SendIcon color={message.trim() ? 'secondary' : 'disabled'} />
      </IconButton>
    </Tooltip>
  </Box>
);

const MessageList = ({ messages, currentUser  }) => {
  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return messageDate.toLocaleDateString([], { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages || []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        p: 2,
        backgroundColor: theme.palette.background.paper
      }}
    >
      {Object.keys(groupedMessages).length > 0 ? (
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                mb: 2,
                position: 'sticky',
                top: 0,
                backgroundColor: 'rgba(30,30,30,0.8)',
                padding: '5px 0',
                borderRadius: '4px'
              }}
            >
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', day: 'numeric', month: 'long' 
              })}
            </Typography>
            
            {dateMessages.map((msg, index) => {
              const isCurrentUser  = msg.senderId === currentUser ?.id;
              
              return (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    mb: 2, 
                    justifyContent: isCurrentUser  ? 'flex-end' : 'flex-start' 
                  }}
                >
                  {!isCurrentUser  && (
                    <Avatar sx={{ mr: 2, bgcolor: 'blue' }}>
                      {msg.senderName?.charAt(0) || '?'}
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      backgroundColor: isCurrentUser  ? '#1164A3' : '#2C2C2C',
                      borderRadius: '8px',
                      p: 1.5,
                      maxWidth: '70%',
                      position: 'relative'
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
                        mt: 0.5
                      }}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </Typography>
                  </Box>
                  {isCurrentUser  && (
                    <Avatar sx={{ ml: 2, bgcolor: 'green' }}>
                      {msg.senderName?.charAt(0) || '?'}
                    </Avatar>
                  )}
                </Box>
              );
            })}
          </Box>
        ))
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            mt: 4
          }}
        >
          No messages yet. Start a conversation!
        </Typography>
      )}
    </Box>
  );
};

const UserChatUI = ({ id }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const messageEndRef = useRef(null);
  const dispatch = useDispatch();
  
  const { messages } = useSelector((state) => state.messages);
  useEffect(() => {
    // Load messages from the Redux store when the component mounts
    dispatch(fetchMessages());
  }, [dispatch]);
  
  const currentUser = useSelector((state) => state.auth.user);
  const selectedUser = useSelector((state) => state.auth.selectedUser);

useEffect(() => {
  if (id) {
    dispatch(fetchSelectedUser(id));
  }
}, [dispatch, id]);
  
  useEffect(() => {
    if (selectedUser?.id) {
      dispatch(fetchMessages(selectedUser.id));
    }
  }, [dispatch, selectedUser?.id, currentUser?.id]);
  const users = useSelector((state) => state.auth.users);

  const error = useSelector((state) => state.auth.error);
  
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io('http://192.168.0.152:8000');
    setSocket(newSocket);
    
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
      setIsOnline(true);
      showNotification('Connected to chat server', 'success');
    });
    
    socket.on('disconnect', () => {
      setIsOnline(false);
      showNotification('Disconnected from chat server', 'error');
    });
    
    socket.on('receive_message', (incomingMessage) => {
      console.log('Received message:', incomingMessage); // Debugging log to confirm message reception
      dispatch(addMessage(incomingMessage));
      
      if (incomingMessage.senderId !== currentUser ?.id && document.hidden) {
        const senderName = incomingMessage.senderName || 'Someone';
        new Notification(`New message from ${senderName}`, {
          body: incomingMessage.text.substring(0, 50) + (incomingMessage.text.length > 50 ? '...' : '')
        });
      }
    });
    
    socket.on('user_typing', (data) => {
      if (data.senderId === selectedUser ?.id || data.senderId === selectedUser ?.data?.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
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
      
  
  }, [socket, dispatch, currentUser , selectedUser ]);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSendMessage = () => {
    if (!selectedUser) {
      showNotification('Please select a user to chat with.', 'warning');
      return;
    }
    if (message.trim() && socket) {
      const userId = currentUser ?.id || currentUser ?.userId || 'unknown-user';
      const userName = currentUser ?.fullName || currentUser ?.name || 'Unknown User';
      
      const recipientData = selectedUser ?.data || selectedUser  || {};
      const receiverId = recipientData.id || recipientData.userId || 'unknown-receiver';
      const receiverName = recipientData.fullName || recipientData.name || 'Unknown Recipient';
      
      const newMessage = {
        senderName: userName,
        receiverName: receiverName,
        text: message,
        senderId: userId,
        receiverId: receiverId,
        timestamp: new Date().toISOString()
      };

      console.log('Sending message with complete data:', newMessage);
      
      dispatch(sendMessage({ content: message, receiverId }))
        .unwrap()
        .then(() => {
          console.log('Message sent successfully');
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
        });

      socket.emit('send_message', newMessage);
      dispatch(addMessage(newMessage));
      setMessage('');
      showNotification('Message sent successfully!', 'success');
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (socket && selectedUser ) {
      socket.emit('user_typing', {
        senderId: currentUser ?.id || currentUser ?.userId,
        receiverId: selectedUser ?.id || selectedUser ?.data?.id
      });
    }
  };

  return ( 
    <ThemeProvider theme={theme}> 
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh', 
          width: '77vw', 
          backgroundColor: theme.palette.background.default 
        }} 
      > 
        <Header user={selectedUser?.data || selectedUser} isOnline={isOnline} isTyping={isTyping} error={error} /> 
        <MessageList messages={messages} currentUser={currentUser} /> 
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

export default UserChatUI; // Change this line to export SlackChatUI
