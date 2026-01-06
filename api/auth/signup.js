import jwt from "jsonwebtoken";
import { ID } from "node-appwrite";
import { createAppwriteClient } from "../config/appwrite";

export const config = {
  api: {
    bodyParser: true
  }
};


export default async function signup(req, res) {

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

  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, pass, type } = req.body;

    if (!name || !email || !pass) {
      return res.status(400).json({
        error: "Name, email and password are required"
      });
    }

    const { auth , db } = await createAppwriteClient(req);

    const user = await auth.create(
      ID.unique(),
      email,
      pass,
      name
    );

    await db.createDocument(
      process.env.DB_ID,      
      "users",               
      ID.unique(),
      {
        userId: user.$id,
        name: name,
        accountType: type,
        phone: "",
        avatarId: ""
      }
    );

    const token = jwt.sign(
      { userId: user.$id },
      "2f5c2ef6ffbdf785c5f23490758cc575",
      { expiresIn: "7d" }
    );

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; SameSite=None; Secure`
    );

    return res.status(201).json({
      success: true,
      message: `Signup successful. Verification email sent to ${email}`,
      userId: user.$id
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(400).json({
      error: error.message || "Signup failed"
    });
  }
}
