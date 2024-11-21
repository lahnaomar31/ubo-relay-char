import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Box, Container, Typography, Divider } from '@mui/material';
import UserList from './components/UserList';
import RoomList from './components/RoomList';

const Messages = () => {
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [rooms, setRooms] = useState([]); // Liste des salons
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour voir les utilisateurs.');
          return;
        }

        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les utilisateurs.');
      }
    };

    const fetchRooms = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour voir les salons.');
          return;
        }

        const response = await fetch('/api/rooms', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        } else {
          throw new Error('Erreur lors de la récupération des salons');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les salons.');
      }
    };

    fetchUsers();
    fetchRooms();
  }, []);

  const handleUserSelect = (id) => {
    navigate(`/messages/user/${id}`); // Naviguer vers la conversation de l'utilisateur
  };

  const handleRoomSelect = (id) => {
    navigate(`/messages/room/${id}`); // Naviguer vers la conversation du salon
  };

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', marginTop: '20px' }}>
      {/* Liste des utilisateurs et des salons */}
      <Box sx={{ width: '25%', paddingRight: 2, borderRight: '1px solid #ddd' }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Utilisateurs</Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <UserList users={users} onUserSelect={handleUserSelect} />
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ marginBottom: 2 }}>Salons</Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <RoomList rooms={rooms} onRoomSelect={handleRoomSelect} />
        )}
      </Box>

      {/* Zone de chat */}
      <Box sx={{ flex: 1, marginLeft: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};

export default Messages;
