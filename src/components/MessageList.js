import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const MessageList = ({ messages, currentUserId }) => {
  const messageEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', padding: 2 }}>
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: message.senderId === currentUserId ? 'row-reverse' : 'row',
            alignItems: 'center',
            marginBottom: 1,
          }}
        >
          <Box
            sx={{
              backgroundColor: message.senderId === currentUserId ? '#DCF8C6' : '#E5E5EA',
              padding: 1.5,
              borderRadius: 1,
              maxWidth: '60%',
              wordWrap: 'break-word',
            }}
          >
            <Typography variant="caption" sx={{ color: '#888' }}>
              {message.sender} - {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: 0.5 }}>
              {message.text}
            </Typography>
          </Box>
        </Box>
      ))}
      <div ref={messageEndRef} />
    </Box>
  );
};

export default MessageList;
