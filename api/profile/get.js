import { createAppwriteClient } from "../config/appwrite";

export default async function loadProfile(req, res) {
  const allowedOrigins = [
        "https://au-ride.vercel.app",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if(req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const databaseID = "profiles";

    if(!databaseID){
      return res.status(500).json({ error: "Database ID is not configured." });
    }

  try {
    const { db, auth } = await createAppwriteClient();

    const user = await auth.get();

    const profile = await db.listDocuments(
      "profiles",
      "profiles",
      [`equal("userId", "${user.$id}")`]
    );

    if (profile.total === 0) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      profile: profile.documents[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
