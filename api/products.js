import { connectDB } from "../lib/mongodb.js";

export default async function handler(req, res) {
  const db = await connectDB();

  const products = await db
    .collection("products")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  res.json(products);
}