import { getConnecterUser, triggerNotConnected } from "../lib/session";
import PushNotifications from "@pusher/push-notifications-server";

export default async (req, res) => {
  try {
    // Récupérer l'utilisateur connecté
    const userIDInQueryParam = req.query["user_id"];
    const user = await getConnecterUser(req);

    console.log("PushToken Request: " + userIDInQueryParam + " -> " + JSON.stringify(user));

    if (!user || userIDInQueryParam !== user.externalId) {
      console.log("Utilisateur non connecté ou mauvais externalId.");
      triggerNotConnected(res);
      return;
    }

    // Initialiser le client Beams
    const beamsClient = new PushNotifications({
      instanceId: process.env.PUSHER_INSTANCE_ID,
      secretKey: process.env.PUSHER_SECRET_KEY,
    });

    // Générer le token Beams
    const beamsToken = beamsClient.generateToken(user.externalId);

    console.log("Beams Token généré avec succès : ", JSON.stringify(beamsToken));
    res.status(200).send(beamsToken);
  } catch (error) {
    console.error("Erreur lors de la génération du token Beams :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};