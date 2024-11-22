import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', // Linear gradient pour l'en-tête
        color: '#fff',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderBottom: '4px solid #303f9f',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 'bold',
          fontSize: '1.8rem',
          letterSpacing: '1px',
          animation: 'fadeIn 0.6s ease-in-out',
        }}
      >
        Relay Chat App
      </Typography>

      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          background: 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)', // Linear gradient pour le bouton
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          textTransform: 'uppercase',
          padding: '8px 16px',
          borderRadius: '20px',
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          ':hover': {
            background: 'linear-gradient(90deg, #dd2476 0%, #ff512f 100%)', // Inversion des couleurs au survol
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        Déconnexion
      </Button>
    </Box>
  );
};

export default Header;
