// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_BASE_URL = 'http://192.168.0.152:8000/api'; // Ensure this endpoint is correct

// // Initial state for messages
// const initialState = {
//   messages: [], // Change to an array to store messages
//   loading: false,
//   error: null,
//   loading: false,
//   error: null,
// };

// export const fetchMessages = createAsyncThunk('messages/fetchMessages', async ({ userId }, { rejectWithValue }) => {
//   if (!userId) {
//     return rejectWithValue('User ID is required');
//   }
//   const token = localStorage.getItem('token');
//   if (!token) {
//     return rejectWithValue('No token found');
//   }
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(`${API_BASE_URL}/messages/${userId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data.messages || []; 
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
//   }
// });

// // Send Message Thunk
// export const sendMessage = createAsyncThunk('messages/sendMessage', async ({ content, receiverId }, { rejectWithValue }) => {
//   try {
//     const token = localStorage.getItem('token');
//     console.log('Sending message:', { content, receiverId });
//       const response = await axios.post(`${API_BASE_URL}/messages`, { content, receiverId, userId }, {

//       headers: { Authorization: `Bearer ${token}` }
//     });
//     console.log('Response from server:', response.data);
//     return response.data.message;
//   } catch (error) {
//     return rejectWithValue(error.response?.data?.message || 'Failed to send message');
//   }
// });

// const messagesSlice = createSlice({
//   name: 'messages',
//   initialState,
//   reducers: {
//     addMessage: (state, action) => {
//       const messageExists = state.messages.some(
//         msg => msg.timestamp === action.payload.timestamp && 
//                msg.senderId === action.payload.senderId &&
//                msg.text === action.payload.text
//       );
      
//       if (!messageExists) {
//         state.messages.push(action.payload); 
//       }
//     },
//     clearMessages: (state) => {
//       state.messages = [];
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMessages.pending, (state) => { 
//         state.loading = true; 
//         state.error = null;
//       })
//       .addCase(fetchMessages.fulfilled, (state, action) => { 
//         state.loading = false; 
//         state.messages = action.payload || []; 
//       })
//       .addCase(fetchMessages.rejected, (state, action) => { 
//         state.loading = false; 
//         state.error = action.payload; 
//       })
//       .addCase(sendMessage.pending, (state) => {
//         state.error = null;
//       })
//       .addCase(sendMessage.fulfilled, (state, action) => { 
//         if (action.payload) {
//           state.messages.push(action.payload);
//         }
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   }
// });

// export const { addMessage, clearMessages } = messagesSlice.actions;
// export default messagesSlice.reducer;


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

      console.log(" heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy",response.data.messages);
      
      return response.data.messages || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

console.log("heyy rajjj1");

const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log("📨 Sending message...", messageData);  // Log message data
     
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("✅ Message Sent Successfully:", response.data);
      return response.data.message;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

console.log("heyy rajjj2");


const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload || [];
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});
export const { addMessage, clearMessages } = messagesSlice.actions; 
export { fetchMessages, sendMessage };
export default messagesSlice.reducer;