import React, { useState } from "react";
import { loginUser } from "./loginApi";
import { CustomError } from "../model/CustomError";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Appeler loginUser et gérer l'état en fonction du résultat
    loginUser(
      {
        user_id: -1,
        username: (formData.get("login") as string) || "",
        password: (formData.get("password") as string) || "",
      },
      (session) => {
        console.log(session);
        setError("");
        // Rediriger vers la page de messages après une connexion réussie
        navigate("/messages");
      },
      (loginError) => {
        console.log(loginError);
        setError(loginError.message || "Erreur de connexion");
      }
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
          UBO Relay Chat
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Identifiant"
            name="login"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Mot de passe"
            type="password"
            name="password"
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
            Connexion
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
}
