// profile/get.js
import jwt from "jsonwebtoken";
import { createAppwriteClient } from "../config/appwrite";

export const config = {
  api: { bodyParser: false } // GET request, bodyParser nahi chahiye
};

// Helper function to parse cookies
// function getTokenFromCookies(cookieHeader) {
//   if (!cookieHeader) return null;
//   const cookies = cookieHeader.split(";").map(c => c.trim());
//   const tokenCookie = cookies.find(c => c.startsWith("token="));
//   if (!tokenCookie) return null;
//   return tokenCookie.split("=")[1];
// }

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
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization" // Add Authorization here
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
}


  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    // ✅ Get JWT from cookie
    const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
const token = authHeader.split(" ")[1];
const decoded = jwt.verify(token, "2f5c2ef6ffbdf785c5f23490758cc575");

    const userId = decoded.userId;

    // ✅ Appwrite DB
    const { db } = createAppwriteClient(req);

    const result = await db.listDocuments(
      "profiles",   // DATABASE ID
      "users",      // COLLECTION ID
      [`equal("userId", "${userId}")`]
    );

    if (result.total === 0) {
      return res.json({ exists: false });
    }

    // ✅ Return profile
    return res.json({
      exists: true,
      profile: result.documents[0]
    });

  } catch (error) {
    console.error("Profile GET Error:", error.message);
    return res.status(401).json({ error: "Unauthorized: " + error.message });
  }
}
