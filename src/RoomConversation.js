import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image"; // Import Material-UI Image icon
import SendIcon from "@mui/icons-material/Send"; // Icone pour le bouton envoyer
import "./App.css";
import { put } from "@vercel/blob"; // Import Vercel Blob


const RoomConversation = () => {
  const { id } = useParams(); // ID du salon
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // Indicateur de préchargement
  const fileInputRef = useRef(null); // Initialize fileInputRef
  const [file, setFile] = useState(null); // File upload state
  const currentUser = JSON.parse(sessionStorage.getItem("user")); // Utilisateur connecté
  const token = sessionStorage.getItem("token"); // Token d'authentification

  const messagesEndRef = useRef(null); // Référence pour auto-scroll

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Activer le spinner
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
            image: msg.image || null, // Inclure l'image si elle existe
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
        setLoading(false); // Désactiver le spinner
      }
    };

    fetchMessages();
  }, [id, token]); // Recharger à chaque changement de salon (ID)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Auto-scroll à chaque mise à jour des messages


  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file){
      console.error("No message or file to send.");
      return;
    } 

    try {
      let imageUrl = null;
  
      // Si un fichier est sélectionné, téléchargez-le
      if (file) {
        const blobResponse = await put(file.name, file, {
          access: "public",
          token: process.env.REACT_APP_BLOB_READ_WRITE_TOKEN, // Assurez-vous que le token est configuré
        });
        imageUrl = blobResponse.url; // Obtenez l'URL publique du fichier
        console.log("Image URL:", imageUrl); // Vérifiez que l'URL de l'image est correcte
      }
  
      const payload = {
        roomId: id,
        message: newMessage.trim(),
        image: imageUrl, // Inclure l'URL de l'image si elle existe
      };

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));
    

      const response = await fetch("/api/send-room-message", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: data.message.text,
            image: data.message.image,
            sender: currentUser?.username,
            timestamp: new Date(data.message.timestamp),
          },
        ]);
        setNewMessage("");
        setFile(null); // Réinitialiser l'entrée de fichier

      } else {
        const error = await response.json();
        console.error("Erreur lors de l'envoi du message :", error.error || response.statusText);
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
        overflow: "hidden", // Empêche les débordements
        boxSizing: "border-box",
        padding: 2,
        animation: "slideIn 0.5s ease-in-out",
      }}
    >
      {!id ? (
        <Typography variant="h6" color="error" align="center">
          Aucun salon sélectionné
        </Typography>
      ) : (
        <>
          {/* En-tête du salon */}
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
            <Typography variant="h6">Salon : {id}</Typography>
          </Box>

          {/* Liste des messages défilables */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Ombre douce pour un look moderne
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
                  {/* Affichage du nom de l'expéditeur */}
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
                  {msg.text && (
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
                  )}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded content"
                      style={{ maxWidth: "300px", borderRadius: "8px", marginTop: "8px" }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#777",
                      marginTop: "5px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="textSecondary" align="center">
                Aucun message dans ce salon.
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Zone de saisie */}
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
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current.click()} // Trigger file input dialog
              sx={{
                background: "#fff",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                marginRight: "10px",
              }}
            >
              <ImageIcon />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
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
              disabled={!newMessage.trim() && !file}
              startIcon={<SendIcon />}
              >
              Send
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default RoomConversation;
