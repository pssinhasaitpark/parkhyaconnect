import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.152:8000/api";

// Initial state
const initialState = {
  channels: [],
  loading: false,
  error: null,
};

// Fetch Channels Thunk
export const fetchChannels = createAsyncThunk(
  "channels/fetchChannels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/channels`);
      return response.data; // Assuming the API returns the channels
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch channels"
      );
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
      return response.data; // Assuming the API returns the created channel
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create channel"
      );
    }
  }
);

// Add Member Thunk
export const addMemberToChannel = createAsyncThunk(
  "channels/addMemberToChannel",
  async ({ channelId, memberId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/channels/${channelId}/members`,
        { memberId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Assuming the API returns the updated channel
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add member to channel"
      );
    }
  }
);

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload; // Update channels with fetched data
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels.push(action.payload); // Add the new channel to the state
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export default channelsSlice.reducer;
