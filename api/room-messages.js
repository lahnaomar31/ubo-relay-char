import { getConnecterUser } from "../lib/session";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async (req, res) => {
  try {
    const user = await getConnecterUser(req);
    if (!user) {
      return res.status(401).json({ error: "User not connected" });
    }

    const { roomId } = req.query;
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    try {
      const rawMessages = await redis.lrange(`room:${roomId}:messages`, 0, -1);
      console.log(`Raw messages retrieved from Redis for room:${roomId}:`, rawMessages);

      if (!rawMessages || rawMessages.length === 0) {
        console.warn(`No messages found for room:${roomId}`);
        return res.status(404).json({ error: "No messages found for this room" });
      }

      const parsedMessages = rawMessages
      .map((msg) => {
        if (typeof msg === "string") {
          try {
            return JSON.parse(msg); // Convertir JSON string en objet
          } catch (parseError) {
            console.error("Invalid JSON in Redis, skipping message:", msg);
            return null; // Ignorer les messages corrompus
          }
        }
        return msg; // Si déjà un objet, le retourner tel quel
      })
      .filter(Boolean); // Supprimer les messages invalides

      res.status(200).json(parsedMessages);
    } catch (redisError) {
      console.error("Redis error:", redisError);
      res.status(500).json({ error: "Failed to retrieve messages from Redis" });
    }
  } catch (error) {
    console.error("Error fetching room messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
