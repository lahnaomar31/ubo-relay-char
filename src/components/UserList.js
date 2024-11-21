import React, { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const UserList = ({ users, onUserSelect }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId); // Mettre à jour l'utilisateur sélectionné
    onUserSelect(userId); // Appeler la fonction fournie pour gérer la sélection
  };

  return (
    <List>
      {users.map((user) => (
        <ListItem
          key={user.user_id}
          button
          onClick={() => handleUserClick(user.user_id)}
          sx={{
            backgroundColor: selectedUserId === user.user_id ? '#f0f0f0' : 'transparent',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
            borderLeft: selectedUserId === user.user_id ? '4px solid #1976d2' : '4px solid transparent',
          }}
        >
          <ListItemText
            primary={user.username}
            secondary={user.last_login || 'Jamais connecté'}
            sx={{
              color: selectedUserId === user.user_id ? '#1976d2' : 'inherit',
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
