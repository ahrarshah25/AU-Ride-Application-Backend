import { createAppwriteClient } from "../config.js";

export default async function handler(req, res) {
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