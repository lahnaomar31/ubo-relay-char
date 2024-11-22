import React, { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const RoomList = ({ rooms, onRoomSelect }) => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId); // Mettre à jour le salon sélectionné
    onRoomSelect(roomId); // Appeler la fonction pour gérer la sélection
  };

  return (
    <List>
      {rooms.map((room) => (
        <ListItem
          key={room.room_id}
          button
          onClick={() => handleRoomClick(room.room_id)}
          sx={{
            backgroundColor: selectedRoomId === room.room_id ? '#f0f0f0' : 'transparent',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            borderLeft: selectedRoomId === room.room_id ? '4px solid #1976d2' : '4px solid transparent',
          }}
        >
          <ListItemText
            primary={room.name}
            sx={{
              color: selectedRoomId === room.room_id ? '#1976d2' : 'inherit',
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RoomList;
