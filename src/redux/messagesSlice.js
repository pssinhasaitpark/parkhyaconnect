import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.152:8000/api';

// Fetch messages
const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.messages || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Send message
const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const { content, receiverId, senderId } = messageData;
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        { content, receiverId, senderId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      // Only add the message if it doesn't already exist
      const messageExists = state.messages.some(
        msg => msg.id === action.payload.id
      );
      if (!messageExists) {
        state.messages.push(action.payload);
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
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
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Don't add the message here as it will be added through the socket event
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export { fetchMessages, sendMessage };
export default messagesSlice.reducer;