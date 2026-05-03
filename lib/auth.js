import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new Error("No token");

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, process.env.JWT_SECRET);
}

export function requireRole(user, roles = []) {
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
}