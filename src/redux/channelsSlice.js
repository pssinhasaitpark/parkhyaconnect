import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.152:8000/api";

// Initial state
const initialState = {
  channels: [],
  currentChannel: null,
  loading: false,
  error: null,
  availableUsers: [],
};

// Centralized error handling
const handleError = (error) => {
  return error.response?.data?.message || "An error occurred";
};

// Fetch Channels Thunk
export const fetchChannels = createAsyncThunk(
  "channels/fetchChannels",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/channels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data || []; // Ensure it returns an array
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch Single Channel Details Thunk
export const fetchChannelDetails = createAsyncThunk(
  "channels/fetchChannelDetails",
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/channels/${channelId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data || {}; // Ensure it returns an object
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Create Channel Thunk
export const createChannel = createAsyncThunk(
  "channels/createChannel",
  async (channelData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/channels`,
        channelData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data || {}; // Ensure it returns an object
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch Available Users for Adding to Channel
export const fetchAvailableUsers = createAsyncThunk(
  "channels/fetchAvailableUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      let allUsers = [];
      let page = 1;
      let hasMoreUsers = true;

      while (hasMoreUsers) {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page },
        });

        const users = response.data.data.users || [];
        allUsers = allUsers.concat(users);
        hasMoreUsers = users.length > 0;
        page++;
      }

      return allUsers; // Return all users
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Add Member to Channel Thunk
export const addMemberToChannel = createAsyncThunk(
  "channels/addMemberToChannel",
  async ({ channelId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/channels/${channelId}/members`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { channelId, member: response.data.data || {} }; // Ensure it returns an object
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Fetch Channel Messages Thunk
export const fetchChannelMessages = createAsyncThunk(
  "channels/fetchChannelMessages",
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/channels/${channelId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { channelId, messages: response.data.data || [] }; // Ensure it returns an array
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Send Channel Message Thunk
export const sendChannelMessage = createAsyncThunk(
  "channels/sendChannelMessage",
  async ({ channelId, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        { content, channelId, type: "channel" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { channelId, message: response.data.data || {} }; // Ensure it returns an object
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

// Channels Slice
const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    clearCurrentChannel: (state) => {
      state.currentChannel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Channels Cases
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload; // Set channels to the fetched data
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // Fetch Channel Details Cases
      .addCase(fetchChannelDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelDetails.fulfilled, (state, action) => {
        state.loading = false;
        const channelIndex = state.channels.findIndex(
          (channel) => channel.id === action.payload.id
        );
        if (channelIndex !== -1) {
          state.channels[channelIndex] = action.payload; // Update existing channel
        } else {
          state.channels.push(action.payload); // Add new channel
        }
        state.currentChannel = action.payload; // Set current channel
      })
      .addCase(fetchChannelDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // Create Channel Cases
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels.push(action.payload); // Add new channel
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // Fetch Available Users Cases
      .addCase(fetchAvailableUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.availableUsers = action.payload; // Set available users
      })
      .addCase(fetchAvailableUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // Add Member to Channel Cases
      .addCase(addMemberToChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToChannel.fulfilled, (state, action) => {
        state.loading = false;
        const channelIndex = state.channels.findIndex(
          (channel) => channel.id === action.payload.channelId
        );
        if (channelIndex !== -1) {
          const channel = state.channels[channelIndex];
          if (!channel.members) {
            channel.members = []; // Initialize members array if it doesn't exist
          }
          if (
            !channel.members.some(
              (member) => member.id === action.payload.member.id
            )
          ) {
            channel.members.push(action.payload.member); // Add new member
          }
        }
      })
      .addCase(addMemberToChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // Fetch Channel Messages Cases
      .addCase(fetchChannelMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelMessages.fulfilled, (state, action) => {
        state.loading = false;
        const channelIndex = state.channels.findIndex(
          (channel) => channel.id === action.payload.channelId
        );
        if (channelIndex !== -1) {
          state.channels[channelIndex].messages = action.payload.messages; // Set messages for the channel
        }
        if (state.currentChannel?.id === action.payload.channelId) {
          state.currentChannel.messages = action.payload.messages; // Set messages for the current channel
        }
      })
      .addCase(fetchChannelMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // Send Channel Message Cases
      .addCase(sendChannelMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChannelMessage.fulfilled, (state, action) => {
        state.loading = false;
        const channelIndex = state.channels.findIndex(
          (channel) => channel.id === action.payload.channelId
        );
        if (channelIndex !== -1) {
          if (!state.channels[channelIndex].messages) {
            state.channels[channelIndex].messages = []; // Initialize messages array if it doesn't exist
          }
          state.channels[channelIndex].messages.push(action.payload.message); // Add new message
        }
        if (state.currentChannel?.id === action.payload.channelId) {
          if (!state.currentChannel.messages) {
            state.currentChannel.messages = []; // Initialize messages array if it doesn't exist
          }
          state.currentChannel.messages.push(action.payload.message); // Add new message to current channel
        }
      })
      .addCase(sendChannelMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      });
  },
});

// Export actions and reducer
export const { setCurrentChannel, clearCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;