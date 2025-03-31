import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.152:8000/api";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token provided");
  }
  return token;
};

// Fetch messages for a specific user
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/messages?receiverId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

// Send a new message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const { content, receiverId, senderId, type = "private" } = messageData;
      const token = getToken();

      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        {
          content,
          receiverId,
          senderId,
          type,
          timestamp: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.data; // Extract only the relevant message data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

// Mark a specific message as seen
export const markMessageAsSeen = createAsyncThunk(
  "messages/markMessageAsSeen",
  async (messageId, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${API_BASE_URL}/messages/seen/${messageId}`, // Using GET as per your API
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { 
        id: messageId,
        seen: true,
        seenBy: response.data.seenBy || [] // Assuming response.data contains the list of users who have seen the message
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark message as seen"
      );
    }
  }
);

// Mark all messages as seen for a specific user
export const markAllMessagesSeen = createAsyncThunk(
  "messages/markAllMessagesSeen",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = getToken();
      const { messages } = getState().messages;

      const unreadMessages = messages.filter(
        (msg) => msg.senderId === userId && !msg.seen
      );

      const results = await Promise.allSettled(
        unreadMessages.map(async (msg) => {
          try {
            const response = await axios.get(
              `${API_BASE_URL}/messages/seen/${msg.id}`, 
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            return { id: msg.id, success: true, data: response.data };
          } catch (error) {
            return { id: msg.id, success: false, error };
          }
        })
      );

      const successfulIds = results
        .filter(result => result.status === 'fulfilled' && result.value.success)
        .map(result => result.value.id);

      return successfulIds;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as seen"
      );
    }
  }
);

// Delete a message
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      const token = getToken();
      await axios.delete(
        `${API_BASE_URL}/messages/${messageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return messageId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

// Update a message
export const updateMessageThunk = createAsyncThunk(
  "messages/updateMessage",
  async ({ messageId, content }, { rejectWithValue }) => {
    try {
      const token = getToken();
      const response = await axios.put(
        `${API_BASE_URL}/messages/${messageId}`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update message"
      );
    }
  }
);

// Create the messages slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [], 
    loading: false, 
    error: null, 
    socketConnected: false, 
  },

  reducers: {
    addMessage: (state, action) => {
      const newMessage = action.payload;
      const existingIndex = state.messages.findIndex(msg => msg.id === newMessage.id);
      
      if (existingIndex !== -1) {
        state.messages[existingIndex] = {
          ...state.messages[existingIndex],
          ...newMessage,
        };
      } else {
        const messageExists = state.messages.some(
          (msg) =>
            (msg.content === newMessage.content &&
            msg.senderId === newMessage.senderId &&
            msg.receiverId === newMessage.receiverId &&
            msg.timestamp === newMessage.timestamp)
        );

        if (!messageExists) {
          state.messages.push(newMessage);
        }
      }
    },
    updateMessage: (state, action) => {
      const updatedMessage = action.payload;
      const index = state.messages.findIndex(msg => msg.id === updatedMessage.id);
      
      if (index !== -1) {
        state.messages[index] = {
          ...state.messages[index],
          ...updatedMessage
        };
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    updateMessageSeenStatus: (state, action) => {
      const { id, seen } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === id);
      if (messageIndex !== -1) {
        state.messages[messageIndex].seen = seen;
      }
    },
    removeMessage: (state, action) => {
      const messageId = action.payload;
      state.messages = state.messages.filter(msg => msg.id !== messageId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(markMessageAsSeen.fulfilled, (state, action) => {
        const { id, seenBy } = action.payload;
        const messageIndex = state.messages.findIndex(msg => msg.id === id);
        if (messageIndex !== -1) {
          state.messages[messageIndex].seen = true; // Update the seen status
          state.messages[messageIndex].seenBy = seenBy; // Store the users who have seen the message
        }
      })
      .addCase(markAllMessagesSeen.fulfilled, (state, action) => {
        const messageIds = action.payload;
        state.messages = state.messages.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, seen: true } : msg
        );
      })
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
        const messageExists = state.messages.some(
          msg => msg.id === action.payload.id
        );
        if (!messageExists) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        state.messages = state.messages.filter(msg => msg.id !== messageId);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        // Handle the error if needed
      })
      .addCase(updateMessageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessageThunk.fulfilled, (state, action) => {
        const updatedMessage = action.payload;
        const index = state.messages.findIndex(msg => msg.id === updatedMessage.id);
        
        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            ...updatedMessage
          };
        }
        
        state.loading = false;
      })
      .addCase(updateMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { addMessage, clearMessages, setSocketConnected, updateMessageSeenStatus, removeMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;