import { connectDB } from "../../lib/mongodb.js";
import { verifyToken, requireRole } from "../../lib/auth.js";

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);

    // Only admin allowed
    requireRole(user, ["admin"]);

    const db = await connectDB();

    const users = await db.collection("users").find({}).toArray();

    res.json(users);

  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}