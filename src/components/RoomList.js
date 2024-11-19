import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const RoomList = ({ rooms, onRoomSelect }) => {
  return (
    <List>
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <ListItem button key={room.room_id} onClick={() => onRoomSelect(room.room_id)}>
            <ListItemText primary={room.name} />
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="Aucun salon disponible" />
        </ListItem>
      )}
    </List>
  );
};

export default RoomList;
