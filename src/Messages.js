import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Box, Container, TextField, Button, Typography, Divider } from '@mui/material';
import UserList from './components/UserList';
import RoomList from './components/RoomList';

const Messages = () => {
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [rooms] = useState(['General', 'News', 'Random']); // Liste des salons
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Contenu du message
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch les utilisateurs
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

    fetchUsers();
  }, []);

  const handleUserSelect = (id) => {
    navigate(`/messages/user/${id}`); // Naviguer vers la conversation de l'utilisateur
  };

  const handleSendMessage = () => {
    // Ajouter votre logique pour envoyer un message global ou une autre action
    console.log('Message envoyé:', message);
    setMessage('');
  };

  return (
    <Container maxWidth="lg" style={{ display: 'flex', marginTop: '20px' }}>
      {/* Liste des utilisateurs et des salons */}
      <Box sx={{ width: '25%', paddingRight: 2, borderRight: '1px solid #ddd' }}>
        <Typography variant="h6">Utilisateurs</Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <UserList users={users} onUserSelect={handleUserSelect} />
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Salons</Typography>
        <RoomList rooms={rooms} />
      </Box>

      {/* Zone de chat et boutons */}
      <Box sx={{ flex: 1, marginLeft: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Contenu principal injecté */}
        <Outlet />

        {/* Champ de saisie et boutons */}
        {/* <Box sx={{ display: 'flex', padding: 2 }}>
          <TextField
            fullWidth
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" color="primary" sx={{ mx: 1 }}>
            Image
          </Button>
          <Button variant="contained" color="primary" onClick={handleSendMessage}>
            Envoyer
          </Button>
        </Box> */}
      </Box>
    </Container>
  );
};

export default Messages;
