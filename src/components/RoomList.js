// src/components/RoomList.js
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const RoomList = ({ rooms }) => (
  <List>
    {rooms.map((room, index) => (
      <ListItem key={index} button>
        <ListItemText primary={room} />
      </ListItem>
    ))}
  </List>
);

export default RoomList;
