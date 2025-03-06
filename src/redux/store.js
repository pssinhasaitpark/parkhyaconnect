import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import messagesReducer from './messagesSlice';
import channelsReducer from './channelsSlice'; // Import channelsReducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,  // Add messages reducer here
    channels: channelsReducer, // Add channelsReducer to the store
    },

});

export default store;
