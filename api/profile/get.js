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
    const { auth, db } = createAppwriteClient(req);

    const user = await auth.get();

    const result = await db.listDocuments(
      "profiles",
      "users",
      [`equal("userId", "${user.$id}")`]
    );

    if (result.total === 0) {
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      profile: result.documents[0]
    });

  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}