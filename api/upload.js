import formidable from "formidable";
import fs from "fs";
import cloudinary from "../lib/cloudinary.js";
import { connectDB } from "../lib/mongodb.js";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = files.image;

    const upload = await cloudinary.uploader.upload(file.filepath);

    const db = await connectDB();

    await db.collection("products").insertOne({
      title: fields.title,
      price: parseFloat(fields.price),
      description: fields.description,
      category: fields.category,
      image: upload.secure_url,
      createdAt: new Date(),
    });

    res.json({ status: "success" });
  });
}