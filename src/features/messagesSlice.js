// src/features/messagesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: {},
    selectedConversationId: null,
  },
  reducers: {
    setConversation: (state, action) => {
      state.conversations[action.payload.id] = action.payload.messages;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      state.conversations[conversationId] = [
        ...(state.conversations[conversationId] || []),
        message,
      ];
    },
    selectConversation: (state, action) => {
      state.selectedConversationId = action.payload;
    },
  },
});

export const { setConversation, addMessage, selectConversation } = messagesSlice.actions;
export default messagesSlice.reducer;
