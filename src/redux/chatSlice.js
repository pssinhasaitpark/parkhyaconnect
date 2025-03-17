import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://192.168.0.152:8000/api";

export const getUserById = async (userID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userID}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};


export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userID, { rejectWithValue }) => {
    try {
      return await getUserById(userID);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "selectedUser",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
