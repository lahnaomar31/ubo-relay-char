import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image"; // Import Material-UI Image icon
import SendIcon from "@mui/icons-material/Send"; // Icone pour le bouton envoyer
import "./App.css";
import { put } from "@vercel/blob"; // Import Vercel Blob

const Conversation = () => {
  const { id } = useParams(); // ID of the conversation
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading indicator
  const fileInputRef = useRef(null); // Initialize fileInputRef
  const currentUser = JSON.parse(sessionStorage.getItem("user")); // Logged-in user
  const token = sessionStorage.getItem("token"); // Authentication token
  const [file, setFile] = useState(null); // File state
  const messagesEndRef = useRef(null); // Reference for auto-scroll

  useEffect(() => {
    const fetchMessages = async () => {
      setMessages([]); // Clear messages when switching conversations
      setLoading(true);
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
            image: msg.image || null,
            sender: msg.sender || "unknown",
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(formattedMessages);
        } else {
          console.error("Error fetching messages.");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
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
    if (!newMessage.trim() && !file) {
      console.error("No message text or file to send.");
      return;
    }

    console.log("Sending message to recipientId:", id); // Log current recipientId

  
    try {
      let imageUrl = null;
  
      // Upload file if it exists
      if (file) {
        const blobResponse = await put(file.name, file, {
          access: "public",
          token: process.env.REACT_APP_BLOB_READ_WRITE_TOKEN, // Ensure this token is correctly set
        });
        imageUrl = blobResponse.url;
      }
  
      const payload = {
        recipientId: id,
        message: newMessage.trim(),
        image: imageUrl,
      };
  
      console.log("Payload being sent:", JSON.stringify(payload, null, 2));
  
      const response = await fetch("/api/message", {
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
        setNewMessage(""); // Reset message input
        setFile(null); // Reset file input
      } else {
        console.error("Error sending message:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
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
        overflow: "hidden",
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
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              marginBottom: 2,
              textAlign: "center",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
                    sx={{ color: "#555", fontWeight: "bold", marginBottom: "4px" }}
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
              sx={{ marginRight: "10px" }}
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
                background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "20px",
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

export default Conversation;
