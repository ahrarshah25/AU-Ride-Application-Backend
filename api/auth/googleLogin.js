import { createAppwriteClient } from "../config.js";

export default async function handler(req, res) {

    const allowedOrigins = [
        "https://au-ride.vercel.app",
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    try {
        const { auth } = await createAppwriteClient();

        const session = await auth.createOAuth2Session(
            "google",
            "https://au-ride.vercel.app/signup",
            "https://au-ride.vercel.app/signup"
        );

        console.log(session);
        res.status(200).json({ success: true, session });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}