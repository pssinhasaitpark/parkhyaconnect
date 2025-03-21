import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://192.168.0.152:8000/api";

// Helper function to safely set token in localStorage
const saveTokenToStorage = (token) => {
  try {
    if (token) {
      localStorage.setItem("token", token);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error saving token to localStorage:", error);
    return false;
  }
};

// Helper function to safely get token from localStorage
const getTokenFromStorage = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error retrieving token from localStorage:", error);
    return null;
  }
};

const initialState = {
  users: [],
  selectedUser: null,
  currentUser: null,
  userDetails: null,
  isAuthenticated: false,
  token: getTokenFromStorage(),
  messages: [],
  loading: false,
  error: null,
};

// Fetch User Details Thunk
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || getTokenFromStorage();
      if (!token) {
        return rejectWithValue("No authentication token found. Please log in.");
      }
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Return user details
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user details. Please try again.");
    }
  }
);

// Signup Thunk
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      if (response?.data?.token) {
        saveTokenToStorage(response.data.token);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Signup failed due to an unexpected error.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Login Thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const token = response?.data?.token || response?.data?.data?.token || response?.data?.user?.token;
      if (token) {
        saveTokenToStorage(token);
      }
      return { ...response.data, token };
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed due to an unexpected error.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Users Thunk
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || getTokenFromStorage();
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.users.map((user) => ({
        isOnline: user.isOnline,
        id: user.id,
        fullName: user.fullName,
        avatar: user.avatar,
        joinedAt: user.created_at,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const fetchSelectedUser = createAsyncThunk(
  "auth/fetchSelectedUser",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || getTokenFromStorage();
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response data:", response.data.data); 

      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user details");
    }
  }
);

// Fetch Messages Thunk
export const fetchMessages = createAsyncThunk(
  "auth/fetchMessages",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || getTokenFromStorage();
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await axios.get(`${API_BASE_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
    }
  }
);

// Forgot Password Thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// Reset Password Thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, newPassword });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// Send Message Thunk
export const sendMessage = createAsyncThunk(
  "auth/sendMessage",
  async ({ content, receiverId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || getTokenFromStorage();
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        { content, receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      const user = state.users.find(user => user.id === userId);
      if (user) {
        user.isOnline = isOnline;
      }
    },
    initializeAuth: (state) => {
      const token = getTokenFromStorage();
      state.token = token;
      state.isAuthenticated = !!token;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setToken(state, action) {
      const token = action.payload;
      state.token = token;
      state.isAuthenticated = !!token;
      if (token) {
        saveTokenToStorage(token);
      } else {
        localStorage.removeItem("token");
      }
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.selectedUser = null;
      state.currentUser = null;
      state.userDetails = null; // Also clear userDetails
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Also remove user from localStorage
    },
    clearError(state) {
      state.error = null;
    },
    // Add a dedicated action to update currentUser
    updateCurrentUser(state, action) {
      state.currentUser = action.payload;
      // Save to localStorage
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch (error) {
        console.error("Error saving user to localStorage:", error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling fetchUserDetails
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
        state.currentUser = action.payload; // Update currentUser with data from auth/me
        state.isAuthenticated = true;
        
        // Save to localStorage for persistence
        try {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
        }
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login API Response:", action.payload);
    
        if (!action.payload || !action.payload.token || !action.payload.user) {
          console.error("Login API response missing user data!", action.payload);
          return;
        }
    
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.userDetails = action.payload.user; // Also set userDetails
    
        saveTokenToStorage(action.payload.token);
        
        try {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          saveTokenToStorage(action.payload.token);
          
          // If user data is included in the response, update it
          if (action.payload.user) {
            state.currentUser = action.payload.user;
            state.userDetails = action.payload.user;
            
            try {
              localStorage.setItem("user", JSON.stringify(action.payload.user));
            } catch (error) {
              console.error("Error saving user to localStorage:", error);
            }
          }
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSelectedUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSelectedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchSelectedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = [...state.messages, action.payload];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  initializeAuth, 
  setSelectedUser, 
  setToken, 
  logout, 
  clearError, 
  updateUserStatus,
  updateCurrentUser
} = authSlice.actions;

export default authSlice.reducer;
