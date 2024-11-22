import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import "./App.css";

const Conversation = () => {
  const { id } = useParams(); // ID de la conversation
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // Indicateur de préchargement
  const currentUser = JSON.parse(sessionStorage.getItem("user")); // Utilisateur connecté
  const token = sessionStorage.getItem("token"); // Token d'authentification

  const messagesEndRef = useRef(null); // Référence pour auto-scroll

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Activer le préchargement
      try {
        const response = await fetch(`/api/conversation?recipientId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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
          console.error("Erreur lors de la récupération des messages");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false); // Désactiver le préchargement
      }
    };

    fetchMessages();
  }, [id, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: id,
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
        console.error("Erreur lors de l'envoi du message");
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
        height: "100vh",
        width: "100%",
        boxSizing: "border-box",
        padding: 2,
        overflow: "hidden", // Empêche les débordements
        animation: "slideIn 0.5s ease-in-out", // Ajout de l'animation
        backgroundColor: "#f4f6f8",
      }}
    >
      {!id ? (
        <Typography variant="h6" color="error" align="center">
          Aucune conversation sélectionnée
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)", // Ajout du dégradé ici
              color: "#fff",
              marginBottom: 2,
              textAlign: "center",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              animation: "fadeIn 0.6s ease-in-out",
            }}
          >
            <Typography variant="h6">
              Conversation avec {id === currentUser?.username ? "Vous" : id}
            </Typography>
          </Box>


          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: msg.sender === currentUser?.username ? "right" : "left",
                    marginBottom: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#555",
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {msg.sender}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "12px 20px",
                      borderRadius: "20px",
                      backgroundColor:
                        msg.sender === currentUser?.username ? "#00796b" : "#e0e0e0",
                      color: msg.sender === currentUser?.username ? "#fff" : "#000",
                      maxWidth: "70%",
                      wordWrap: "break-word",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#777",
                      marginTop: "5px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary" align="center">
                Aucun message pour le moment.
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid #ddd",
              padding: "16px 0",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <TextField
              fullWidth
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{
                marginRight: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              sx={{
                background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)", // Ajout du dégradé
                color: "#fff",
                fontWeight: "bold",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                padding: "10px 20px",
                borderRadius: "20px",
                boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                ":hover": {
                  background: "linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)", // Inversion du dégradé au survol
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                },
              }}
              disabled={!newMessage.trim()}
            >
              Envoyer
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Conversation;
