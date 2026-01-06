import { ID } from "node-appwrite";
import formidable from "formidable";
import { createAppwriteClient } from "../config/appwrite";

export const config = { api: { bodyParser: false } };

export default async function saveProfile(req, res) {
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
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const form = formidable();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, f, fl) => err ? reject(err) : resolve({ fields: f, files: fl }));
    });

    const { name, phone } = fields;
    const { auth, db, storage } = createAppwriteClient(req);

    const user = await auth.get();
    let avatarId = null;

    if (files.avatar) {
      const uploaded = await storage.createFile(
        "profile-images",
        ID.unique(),
        files.avatar[0]
      );
      avatarId = uploaded.$id;
    }

    const existing = await db.listDocuments(
      "profiles",
      "users",
      [`equal("userId", "${user.$id}")`]
    );

    if (existing.total === 0) {
      await db.createDocument("profiles", "users", ID.unique(), {
        userId: user.$id,
        name,
        phone,
        avatarId
      });
    } else {
      await db.updateDocument(
        "profiles",
        "users",
        existing.documents[0].$id,
        {
          name,
          phone,
          avatarId: avatarId ?? existing.documents[0].avatarId
        }
      );
    }

    return res.json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
