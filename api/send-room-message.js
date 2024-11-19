import { getConnecterUser } from "../lib/session";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async (req, res) => {
  try {
    const user = await getConnecterUser(req);
    if (!user) {
      return res.status(401).json({ error: "User not connected" });
    }

    const { roomId, message } = req.body;
    if (!roomId || !message) {
      return res.status(400).json({ error: "roomId and message are required" });
    }

    const newMessage = {
      text: message,
      sender: user.username,
      timestamp: new Date().toISOString(),
    };

    try {
      const serializedMessage = JSON.stringify(newMessage);
      console.log("Serialized message stored in Redis:", serializedMessage);

      // Ajouter le message dans Redis
      await redis.rpush(`room:${roomId}:messages`, serializedMessage);
      console.log(`Message stored in Redis for room:${roomId}:`, serializedMessage);

      res.status(201).json({ success: true, message: newMessage });
    } catch (redisError) {
      console.error("Redis error:", redisError);
      res.status(500).json({ error: "Failed to save message to Redis" });
    }
  } catch (error) {
    console.error("Error sending room message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
