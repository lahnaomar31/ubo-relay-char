import { getConnecterUser } from "../lib/session";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async (req, res) => {
  try {
    const user = await getConnecterUser(req);
    if (!user) {
      return res.status(401).json({ error: "User not connected" });
    }

    const { recipientId, message } = req.body;
    if (!recipientId || !message) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const conversationId = generateConversationId(user.id, recipientId);

    const newMessage = {
      text: message,
      sender: user.username,
      timestamp: new Date().toISOString(),
    };

    try {
      const serializedMessage = JSON.stringify(newMessage);
      console.log("Serialized message being stored in Redis:", serializedMessage); // Log avant stockage
      await redis.rpush(`conversation:${conversationId}`, serializedMessage);

      res.status(201).json({ success: true, message: newMessage });
    } catch (redisError) {
      console.error("Redis error:", redisError);
      res.status(500).json({ error: "Failed to save message to Redis" });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function generateConversationId(userId1, userId2) {
  return [userId1, userId2].sort().join('-');
}