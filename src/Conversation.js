import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';

const Conversation = () => {
  const { id } = useParams(); // ID de la conversation
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('user')); // Utilisateur connecté
  const token = sessionStorage.getItem('token'); // Token d'authentification

  const messagesEndRef = useRef(null); // Référence pour autoscroll

  // Réinitialisation à chaque changement d'ID
  useEffect(() => {
    setMessages([]);
    setLoading(true);
  }, [id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/conversation?recipientId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedMessages = data.map((msg) => ({
            text: msg.text || '',
            sender: msg.sender || 'unknown',
            timestamp: new Date(msg.timestamp), // Convertir le timestamp en objet Date
          }));
          setMessages(formattedMessages);
        } else {
          console.error('Erreur lors de la récupération des messages');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
        setNewMessage('');
      } else {
        console.error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Liste des messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          border: '1px solid #ccc',
          borderRadius: '10px',
          marginBottom: '16px',
          backgroundColor: '#fafafa',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {loading ? (
          <Typography>Chargement des messages...</Typography>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <Box
              key={`${msg.sender}-${index}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems:
                  msg.sender === currentUser?.username ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
                animation: 'fadeIn 0.5s ease-in',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: msg.sender === currentUser?.username ? '#1976d2' : '#000',
                  marginBottom: '5px',
                }}
              >
                {msg.sender}
              </Typography>

              <Box
                sx={{
                  backgroundColor:
                    msg.sender === currentUser?.username ? '#1976d2' : '#e0e0e0',
                  color: msg.sender === currentUser?.username ? '#fff' : '#000',
                  padding: '12px',
                  borderRadius: '16px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  textAlign: 'left',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  transform: 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  ':hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    display: 'block',
                    textAlign: 'right',
                    marginTop: '5px',
                  }}
                >
                  {msg.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Aucun message dans cette conversation.</Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Zone de saisie */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderTop: '1px solid #ddd',
          padding: '16px 0',
        }}
      >
        <TextField
          fullWidth
          placeholder="Écrivez votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            marginRight: '10px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            ':hover': {
              backgroundColor: '#005bb5',
            },
          }}
          onClick={handleSendMessage}
        >
          Envoyer
        </Button>
      </Box>
    </Box>
  );
};

export default Conversation;
