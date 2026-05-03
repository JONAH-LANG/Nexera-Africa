import { connectDB } from "../lib/mongodb.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const db = await connectDB();

    const existing = await db.collection("users").findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Username taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      password: hashedPassword,
      role: role || "user",
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(user);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}