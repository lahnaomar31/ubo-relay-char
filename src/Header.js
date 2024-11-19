import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem('user'); // Vérifie si un utilisateur est connecté

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login'); // Redirection vers la page de connexion
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
      }}
    >
      <h2>Relay chat app</h2>
      {user && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          style={{ backgroundColor: '#f44336' }}
        >
          DÉCONNEXION
        </Button>
      )}
    </div>
  );
};

export default Header;
