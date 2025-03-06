import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.152:8000/api'; // Ensure this endpoint is correct

// Initial state for messages
const initialState = {
  messages: [], // Ensure messages are initialized
  loading: false,
  error: null,
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (userId, { rejectWithValue }) => {
  if (!userId) {
    return rejectWithValue('User ID is required');
  }
  const token = localStorage.getItem('token');
  if (!token) {
    return rejectWithValue('No token found');
  }
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.messages || []; // Ensure it returns an empty array if no messages
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
  }
});

// Send Message Thunk
export const sendMessage = createAsyncThunk('messages/sendMessage', async ({ content, receiverId }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Sending message:', { content, receiverId }); // Log the request
    const response = await axios.post(`${API_BASE_URL}/messages`, { content, receiverId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Response from server:', response.data); // Log the response
    return response.data.message; // Assuming API returns the sent message
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to send message');
  }
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Action to add a message (for socket.io integration)
    addMessage: (state, action) => {
      // Check if message already exists to prevent duplicates
      const messageExists = state.messages.some(
        msg => msg.timestamp === action.payload.timestamp && 
               msg.senderId === action.payload.senderId &&
               msg.text === action.payload.text
      );
      
      if (!messageExists) {
        state.messages.push(action.payload);
      }
    },
    // Action to clear messages when changing conversations
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => { 
        state.loading = false; 
        state.messages = action.payload || []; 
      })
      .addCase(fetchMessages.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => { 
        // Add the message from the API response
        if (action.payload) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
