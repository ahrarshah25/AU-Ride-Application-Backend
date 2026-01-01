export default function handler(req, res) {
  const projectId = "6952bae80027e91db515";

  const success = encodeURIComponent(
    "http://localhost:5500/Front-End/auth/signup.html?status=success"
  );

  const failure = encodeURIComponent(
    "http://localhost:5500/Front-End/auth/signup.html?status=failed"
  );

  const oauthUrl =
    `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/google` +
    `?project=${projectId}` +
    `&success=${success}` +
    `&failure=${failure}`;

  // 🔥 IMPORTANT PART
  res.writeHead(302, {
    Location: oauthUrl
  });
  res.end();
}
