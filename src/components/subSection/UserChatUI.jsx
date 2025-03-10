import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Badge,
  TextField, // Import TextField from Material-UI
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { addMessage, fetchMessages } from '../../redux/messagesSlice';

import { getColorFromName } from '../../utils/colorUtils';

const Header = ({ user, isOnline, isTyping }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid rgba(255,255,255,0.12)', bgcolor: '#1E1E1E' }}>
    <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color={isOnline ? 'success' : 'error'}>
      <Avatar src={user?.avatar} sx={{ bgcolor: getColorFromName(user?.fullName || 'Unknown') }}>{user?.fullName?.charAt(0) || '?'}</Avatar>
    </Badge>
    <Box>
      <Typography variant="h6" sx={{ color: 'white' }}>
        {user ? user.fullName || user.name || 'Unknown User' : 'No user selected'}
      </Typography>
      {isTyping && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>typing...</Typography>}
    </Box>
  </Box>
);

const DMUI = ({ id, selectedUser, selectedChannel }) => {
  useEffect(() => {
  }, []);
  useEffect(() => {
  }, []);
  const [message, setMessage] = useState('');
  const messageEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const dispatch = useDispatch();
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
      showNotification('Connected', 'success'); 
    });
    
    socket.on('disconnect', () => { 
      setIsOnline(false); 
      showNotification('Disconnected', 'error'); 
    });
    
    socket.on('receive_message', (incomingMessage) => { 
      dispatch(addMessage(incomingMessage)); 
    });
    
    socket.on('user_typing', (data) => { 
      if (data.senderId === selectedUser?.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });
    
    return () => { 
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, selectedUser, dispatch]);

  const showNotification = (message, severity = 'info') => { 
    setNotification({ open: true, message, severity }); 
  };
  
  const handleCloseNotification = () => { 
    setNotification({ ...notification, open: false }); 
  };
  
  const handleSendMessage = async () => {
    if (!recipientData) { 
      showNotification('Please select a user or channel.', 'warning');
      return;
    }
    
    if (message.trim() && socket) {
      const newMessage = { 
        senderName: currentUser.fullName || 'Unknown User', 
        text: message, 
        senderId: currentUser.id, 
        isChannel: !!selectedChannel 
      };

      try {
        await fetch('http://192.168.0.152:8000/api/messages', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: message, receiverId: recipientData.id }),
        });
        socket.emit('send_message', newMessage);
        dispatch(addMessage(newMessage));
        setMessage('');
      } catch (error) {
        showNotification('Error sending message. Please try again.', 'error');
      }
    }
  };

  return ( 
    <Box sx={{ padding: 2 }}>
      <Header 
        user={selectedUser?.data || selectedUser} 
        isOnline={isOnline} 
        isTyping={isTyping} 
      />
      
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
      
      <IconButton onClick={handleSendMessage} color="primary">
        <SendIcon />
      </IconButton>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={4000} 
        onClose={handleCloseNotification} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DMUI;
