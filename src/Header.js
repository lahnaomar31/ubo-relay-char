import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login'); // Redirect to the login page
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
      <h2>Relay Chat App</h2>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout} // No reliance on onLogout prop
        style={{ backgroundColor: '#f44336' }}
      >
        DÉCONNEXION
      </Button>
    </div>
  );
};

export default Header;
