import { verifyToken } from "../lib/auth.js";

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);

    res.json({
      message: "Protected data",
      user,
    });

  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}