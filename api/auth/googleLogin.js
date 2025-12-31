import { createAppwriteClient } from "../config.js";

export default async function handler(req, res) {
  try {
    const { auth } = await createAppwriteClient();

    // Redirect after Google login
    const redirectUrl = "http://localhost:5500/Front-End/auth/signup.html";

    const oauth = await auth.createOAuth2Session(
      "google",
      redirectUrl + "?status=success",
      redirectUrl + "?status=failed"
    );

    // Vercel serverless redirect
    res.writeHead(302, { Location: oauth.href });
    res.end();

  } catch (error) {
    console.error(error);
    // Failed → same signup page with failed status
    res.writeHead(302, { Location: redirectUrl + "?status=failed" });
    res.end();
  }
}