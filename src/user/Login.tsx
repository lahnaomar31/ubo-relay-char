import React, { useState } from "react";
import { loginUser } from "./loginApi";
import { Box, Button, Container, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";


export function Login() {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    loginUser(
      {
        user_id: -1,
        username: (formData.get("login") as string) || "",
        password: (formData.get("password") as string) || "",
      },
      (session) => {
        setError("");
        navigate("/messages");
      },
      (loginError) => {
        setError(loginError.message || "Erreur de connexion");
      }
    );
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: "100px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          animation: "fadeIn 0.5s ease-in-out",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
          UBO Relay Chat - Connexion
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
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2, mb: 2 ,
            background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
            color: "#fff",
          }} >
            Connexion
          </Button>
        </form>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Pas encore de compte ?{" "}
          <Link
            href="#"
            onClick={() => navigate("/register")}
            underline="hover"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
          >
            Créer un compte
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
