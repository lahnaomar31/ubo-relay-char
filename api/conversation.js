import { getConnecterUser } from "../lib/session";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async (req, res) => {
    try {
      const user = await getConnecterUser(req);
      if (!user) {
        return res.status(401).json({ error: "User not connected" });
      }
  
      const { recipientId } = req.query;
      if (!recipientId) {
        return res.status(400).json({ error: "recipientId is required" });
      }
  
      const conversationId = generateConversationId(user.id, recipientId);
  
      try {
        const messages = await redis.lrange(`conversation:${conversationId}`, 0, -1);
        console.log("Raw messages retrieved from Redis:", messages); // Log brut
  
        if (!messages || messages.length === 0) {
          return res.status(404).json({ error: "No messages found for this conversation" });
        }
  
        // Pas de parsing si déjà des objets
        const parsedMessages = messages.map((msg) => {
          if (typeof msg === "string") {
            try {
              return JSON.parse(msg); // Si c'est une chaîne JSON
            } catch (parseError) {
              console.error("Invalid JSON in Redis:", msg);
              return null; // Ignorer les messages non valides
            }
          }
          return msg; // Si c'est déjà un objet
        }).filter(Boolean);
  
        res.status(200).json(parsedMessages);
      } catch (redisError) {
        console.error("Redis error:", redisError);
        res.status(500).json({ error: "Failed to retrieve messages from Redis" });
      }
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

function generateConversationId(userId1, userId2) {
  return [userId1, userId2].sort().join('-');
}
