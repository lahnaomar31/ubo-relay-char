import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

const RoomConversation = () => {
  const { id } = useParams(); // Récupère l'ID du salon
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem("user")); // Utilisateur connecté
  const token = sessionStorage.getItem("token"); // Token d'authentification

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Activer l'état de chargement
      try {
        const response = await fetch(`/api/room-messages?roomId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedMessages = data.map((msg) => ({
            text: msg.text || "",
            sender: msg.sender || "unknown",
            timestamp: new Date(msg.timestamp), // Convertir le timestamp en objet Date
          }));
          setMessages(formattedMessages);
        } else {
          console.error("Erreur lors de la récupération des messages.");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false); // Désactiver l'état de chargement
      }
    };

    fetchMessages();
  }, [id, token]); // Relance l'effet à chaque changement de `id`

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/send-room-message", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: id, // ID du salon
          message: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data.message,
            timestamp: new Date(data.message.timestamp),
          },
        ]);
        setNewMessage("");
      } else {
        console.error("Erreur lors de l'envoi du message.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Liste des messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          marginBottom: "16px",
        }}
      >
        {loading ? (
          <Typography>Chargement des messages...</Typography>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <Box
              key={`${msg.sender}-${index}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  msg.sender === currentUser?.username
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  color: msg.sender === currentUser?.username ? "#007bff" : "#000",
                  marginBottom: "5px",
                }}
              >
                {msg.sender}
              </Typography>

              <Box
                sx={{
                  backgroundColor:
                    msg.sender === currentUser?.username ? "#007bff" : "#f1f1f1",
                  color: msg.sender === currentUser?.username ? "#fff" : "#000",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                  textAlign: "left",
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.75rem",
                    display: "block",
                    textAlign: "right",
                    marginTop: "5px",
                  }}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Aucun message dans ce salon.</Typography>
        )}
      </Box>

      {/* Zone de saisie */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #ddd",
          padding: "16px 0",
        }}
      >
        <TextField
          fullWidth
          placeholder="Écrivez un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
        >
          Envoyer
        </Button>
      </Box>
    </Box>
  );
};

export default RoomConversation;
