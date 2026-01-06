import jwt from "jsonwebtoken";
import { createAppwriteClient } from "../config/appwrite";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function login(req, res) {
  const allowedOrigins = [
    "https://au-ride.vercel.app",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://100.115.92.205:5505",
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email & Password are required.",
      });
    }

    const { auth } = await createAppwriteClient(req);

    const user = await auth.createEmailPasswordSession(email, password);

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; SameSite=None; Secure`
    );

    return res.status(201).json({
      success: true,
      message: `Login successful!`,
      userId: user.$id,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(400).json({
      error: error.message || "Login failed",
    });
  }
}
