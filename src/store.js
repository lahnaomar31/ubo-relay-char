// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import messagesReducer from './features/messagesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    messages: messagesReducer,
  },
});

export default store;
