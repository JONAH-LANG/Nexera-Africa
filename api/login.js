import { connectDB } from "../lib/mongodb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { username, password } = req.body;

    const db = await connectDB();

    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}