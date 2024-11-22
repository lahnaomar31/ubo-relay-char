import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Box, Container, Typography, Divider, CircularProgress } from '@mui/material';
import UserList from './components/UserList';
import RoomList from './components/RoomList';

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour voir les utilisateurs.');
          setLoadingUsers(false);
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
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour voir les salons.');
          setLoadingRooms(false);
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
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchUsers();
    fetchRooms();
  }, []);

  const handleUserSelect = (id) => {
    navigate(`/messages/user/${id}`);
  };

  const handleRoomSelect = (id) => {
    navigate(`/messages/room/${id}`);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        marginTop: '20px',
        height: '100vh',
        backgroundColor: '#f4f6f8',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        animation: 'fadeIn 0.6s ease-in-out',
      }}
    >
      <Box
        sx={{
          width: '25%',
          paddingRight: 2,
          borderRight: '1px solid #ddd',
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          transition: 'all 0.3s ease',
          ':hover': {
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
          Utilisateurs
        </Typography>
        {loadingUsers ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <UserList users={users} onUserSelect={handleUserSelect} />
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
          Salons
        </Typography>
        {loadingRooms ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <RoomList rooms={rooms} onRoomSelect={handleRoomSelect} />
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          marginLeft: 2,
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          animation: 'slideIn 0.7s ease-in-out',
        }}
      >
        <Outlet />
      </Box>
    </Container>
  );
};

export default Messages;
