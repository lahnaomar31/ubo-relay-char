import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#3f51b5',
        color: '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem' }}>
        Relay Chat App
      </h2>
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          backgroundColor: '#f44336',
          color: '#fff',
          fontWeight: 'bold',
          ':hover': {
            backgroundColor: '#d32f2f',
          },
        }}
      >
        DÉCONNEXION
      </Button>
    </div>
  );
};

export default Header;
