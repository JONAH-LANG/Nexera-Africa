import { connectDB } from "../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username } = req.body;

    const db = await connectDB();

    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
        piUid: user.piUid,
      },
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}