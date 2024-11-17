import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Login } from './user/Login';
import { Register } from './user/Register';
import Messages from './Messages';
import Conversation from './Conversation';
import { Client as PushNotifications } from "@pusher/push-notifications-web";
import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    if (!("Notification" in window)) {
      console.error("Les notifications ne sont pas supportées par ce navigateur.");
      return;
    }

    Notification.requestPermission()
      .then((permission) => {
        switch (permission) {
          case "granted":
            console.log("Notifications autorisées !");
            break;
          case "denied":
            console.log("Notifications refusées.");
            break;
          default:
            console.log("Permission par défaut.");
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la demande de permission :", error)
      );

    // Instanciation de Pusher Beams pour les notifications
    const beamsClient = new PushNotifications({
      instanceId: "bb7bb705-9890-428e-95ac-c04998af39da", // Remplacez par votre `Instance ID` spécifique
    });

    // Démarrer le client Beams et s'abonner à un "Device Interest"
    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest("hello")) // Inscription à l'intérêt 'hello'
      .then(() => console.log("Successfully registered and subscribed!"))
      .catch(console.error);
  }, []); // Exécute ce code une seule fois au chargement de l'application

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/messages" element={<Messages />}>
        <Route path="user/:id" element={<Conversation />} />
      </Route>
    </Routes>
  );
}

export default App;
