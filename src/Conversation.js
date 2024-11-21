import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';

const Conversation = () => {
  const { id } = useParams(); // Récupère l'ID de la conversation
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(sessionStorage.getItem('user')); // Récupère l'utilisateur connecté
  const token = sessionStorage.getItem('token'); // Récupère le token d'authentification

  const messagesEndRef = useRef(null); // Référence pour autoscroll

  // Réinitialiser l'état des messages et de chargement lors du changement d'ID
  useEffect(() => {
    setMessages([]); // Effacer les anciens messages
    setLoading(true); // Réinitialiser l'état de chargement
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

          // Assurez-vous que `timestamp` est bien converti en objet `Date`
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

  // Fonction pour scroller automatiquement vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroller vers le bas à chaque changement de messages
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
        console.log('Message envoyé avec succès :', data.message);

        // Ajoutez le nouveau message au tableau des messages
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data.message,
            timestamp: new Date(data.message.timestamp), // Assurez-vous que le nouveau message a un `timestamp` au format Date
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
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '16px',
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
                  msg.sender === currentUser?.username ? 'flex-end' : 'flex-start', // Droite pour le sender, gauche pour le receiver
                marginBottom: '10px',
              }}
            >
              {/* Nom de l'utilisateur */}
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  color: msg.sender === currentUser?.username ? '#007bff' : '#000',
                  marginBottom: '5px',
                }}
              >
                {msg.sender}
              </Typography>

              {/* Message */}
              <Box
                sx={{
                  backgroundColor:
                    msg.sender === currentUser?.username ? '#007bff' : '#f1f1f1',
                  color: msg.sender === currentUser?.username ? '#fff' : '#000',
                  padding: '10px',
                  borderRadius: '10px',
                  maxWidth: '60%',
                  wordWrap: 'break-word',
                  textAlign: 'left',
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
                  {msg.timestamp instanceof Date
                    ? msg.timestamp.toLocaleTimeString()
                    : new Date(msg.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Aucun message dans cette conversation.</Typography>
        )}
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
          placeholder="Écrivez un message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ marginRight: '10px' }}
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

export default Conversation;
