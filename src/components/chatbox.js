import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios'; // Import axios for making HTTP requests

// Create socket connection to backend server
const socket = io('http://192.168.0.152:8000'); // Replace with your backend URL if needed

const Chatbox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(true); // For tracking connection status

  // Set up socket listeners and clean up when component unmounts
  useEffect(() => {
    // Handle receiving messages from the backend
    socket.on('receiveMessage', (msg) => {
      console.log('Received message:', msg); // Log the message
      setMessages((prevMessages) => [...prevMessages, msg]); // Add the received message to the state
    });

    // Handle socket connection status
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('receiveMessage');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Function to send message to backend API and socket
  const sendMessage = async () => {
    if (message.trim()) {
      const msg = { content: message, senderId: '9253357d-2625-40d3-8f66-1425ea306780' }; // Create message object with senderId
      console.log('Sending message:', msg); // Log the message

      // Assuming the token is stored in localStorage after the user logs in
      const token = localStorage.getItem('token'); 

      if (!token) {
        console.error('Authorization token is missing.');
        return;
      }

      // API request to send the message
      try {
        const response = await axios.post('http://192.168.0.152:8000/api/messages', {
          content: msg.content,
          senderId: msg.senderId,
          receiverId: msg.senderId, // Assuming you're sending to the same user for now
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Add token to the Authorization header
          },
        });
        console.log('Message sent successfully:', response.data);

        // Once the message is successfully posted, emit it via socket to notify other clients
        socket.emit('sendMessage', msg);

        // Update the UI with the new message
        setMessages((prevMessages) => [...prevMessages, msg]);
        setMessage(''); // Clear input field

      } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error);
      }
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: '500px', margin: 'auto' }}>
      {/* Connection status */}
      {!connected && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
          Unable to connect to the chat server.
        </Typography>
      )}

      {/* Message Display Area */}
      <Paper sx={{ padding: 2, maxHeight: '300px', overflowY: 'auto', marginBottom: 2 }}>
        {messages.length === 0 ? (
          <Typography variant="body2" color="textSecondary">No messages yet.</Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                padding: '8px',
                borderBottom: '1px solid #eee',
                textAlign: msg.senderId === '9253357d-2625-40d3-8f66-1425ea306780' ? 'right' : 'left', // Align messages based on sender
                backgroundColor: msg.senderId === '9253357d-2625-40d3-8f66-1425ea306780' ? '#e1f5fe' : '#f1f8e9', // Different background color for sender
                borderRadius: '5px',
              }}
            >
              {/* Render the senderId and content */}
              {msg && typeof msg === 'object' && 'content' in msg && 'senderId' in msg && msg.content ? (
                <Typography variant="body1">
                  <strong>{msg.senderId}:</strong> {msg.content}
                </Typography>
              ) : msg && typeof msg === 'object' ? (
                  <Typography variant="body1" color="error">
                    Invalid message format.
                  </Typography>
              ) : (
                <Typography variant="body1" color="error">
                  Invalid message format.
                </Typography>
              )}
            </Box>
          ))
        )}
      </Paper>

      {/* Message Input Area */}
      <TextField
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        sx={{ marginBottom: 2 }}
      />

      {/* Send Button */}
      <Button variant="contained" color="primary" onClick={sendMessage} fullWidth>
        Send
      </Button>
    </Box>
  );
};

export default Chatbox;
