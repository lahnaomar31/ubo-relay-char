import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const UserList = ({ users, onUserSelect }) => {
    return (
        <List>
            {users.map((user) => (
                <ListItem key={user.user_id} button onClick={() => onUserSelect(user.user_id)}>
                    <ListItemText primary={user.username} secondary={user.last_login || 'Jamais connecté'} />
                </ListItem>
            ))}
        </List>
    );
};

export default UserList;
