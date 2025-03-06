import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.152:8000/api';

// Initial state for messages
const initialState = {
  messages: [], // Ensure messages are initialized
  incomingMessage: null, // Add incomingMessage to handle new messages
  loading: false,
  error: null,
};

// Fetch Messages Thunk
export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (userId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.messages;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
  }
});

// Send Message Thunk
export const sendMessage = createAsyncThunk('messages/sendMessage', async ({ content, receiverId }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/messages`, { content, receiverId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.message; // Assuming API returns the sent message
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to send message');
  }
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload); // Add reducer to handle incoming messages
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => { state.loading = false; state.messages = action.payload; })
      .addCase(fetchMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(sendMessage.fulfilled, (state, action) => { state.messages.push(action.payload); });
  },
});

// Export actions and reducer
export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
