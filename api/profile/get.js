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
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const databaseID = "profiles";

    if(!databaseID){
      return res.status(400).json({ error: "Database ID is not configured." });
    }

  try {
    const { db, auth } = createAppwriteClient(req);

    const user = await auth.get();

    if(!user){
      return res.status(400).json({message: "User Not Found"})
    }

    if(user){
      return res.status(200).json({message: "User Found - User ID: " + user.$id})
    }

    const profile = await db.listDocuments(
      "profiles",
      "users",
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
    res.status(400).json({ error: error.message });
  }
}
