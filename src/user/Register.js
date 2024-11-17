import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './registerApi';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    registerUser(
      { username, email, password },
      () => navigate('/login'), // Redirige vers login en cas de succès
      (err) => setError(err.message) // Gère les erreurs
    );
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: "100px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          UBO Relay Chat - Inscription
        </Typography>
        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Identifiant"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Mot de passe"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
            CRÉER UN COMPTE
          </Button>
        </form>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};
