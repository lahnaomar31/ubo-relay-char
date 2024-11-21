import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import { Login } from './user/Login';
import { Register } from './user/Register';
import Messages from './Messages';
import Conversation from './Conversation';
import Header from './Header'; // Import Header
import RoomConversation from './RoomConversation';
import { Client as PushNotifications } from "@pusher/push-notifications-web";
import React, { useEffect } from "react";

function App() {
  const location = useLocation(); // Get the current route

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

    const beamsClient = new PushNotifications({
      instanceId: "bb7bb705-9890-428e-95ac-c04998af39da", // Replace with your specific Instance ID
    });

    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest("hello"))
      .then(() => console.log("Successfully registered and subscribed!"))
      .catch(console.error);
  }, []);

  // Define routes where the Header should not be displayed
  const noHeaderRoutes = ["/login", "/register"];

  return (
    <>
      {/* Conditionally render Header based on the route */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/messages" element={<Messages />}>
          <Route path="user/:id" element={<Conversation />} />
          <Route path="/messages/room/:id" element={<RoomConversation />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;