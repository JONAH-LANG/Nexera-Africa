export default async function handler(req, res) {
  const { productId, amount } = req.body;

  res.json({ success: true });
}