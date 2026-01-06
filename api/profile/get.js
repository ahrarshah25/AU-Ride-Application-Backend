import { createAppwriteClient } from "../config/appwrite";

export default async function getProfile(req, res) {
  const allowedOrigins = [
    "https://au-ride.vercel.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://100.115.92.205:5505"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const token = req.headers.cookie?.split("token=")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { db } = createAppwriteClient(req);

    const result = await db.listDocuments(
      "profiles",
      "users",
      [`equal("userId", "${userId}")`]
    );

    if (result.total === 0) return res.json({ exists: false });

    res.json({ exists: true, profile: result.documents[0] });

  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}