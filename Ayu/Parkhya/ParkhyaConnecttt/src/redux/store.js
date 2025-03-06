import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import messagesReducer from './messagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,  // Add messages reducer here
  },
});

export default store;
