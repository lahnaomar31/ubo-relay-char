import { getConnecterUser } from "../lib/session";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await getConnecterUser(req);
    if (!user) {
      return res.status(401).json({ error: "User not connected" });
    }

    const { recipientId, message, image } = req.body;
    if (!recipientId || (!message && !image)) {
      return res.status(400).json({ error: "Invalid request data. 'recipientId' and at least 'message' or 'image' are required." });
    }

    const conversationId = generateConversationId(user.id, recipientId);

    const newMessage = {
      text: message || "",
      image: image || null,
      sender: user.username,
      timestamp: new Date().toISOString(),
    };

    try {
      const serializedMessage = JSON.stringify(newMessage);
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
  return [userId1, userId2].sort().join("-");
}
