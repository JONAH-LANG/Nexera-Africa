import { connectDB } from "../lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, role, piUid } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const db = await connectDB();

    // Check existing user
    const existingUser = await db.collection("users").findOne({
      $or: [{ username }, { piUid }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
      username,
      role,
      piUid,
      walletAddress: "",
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    res.json({ success: true, user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}