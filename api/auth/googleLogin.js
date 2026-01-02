export default function handler(req, res) {
  const projectId = "6952bae80027e91db515";

  const success = encodeURIComponent(
    "https://au-ride.vercel.app/signup?status=success"  
  );

  const failure = encodeURIComponent(
    "https://au-ride.vercel.app/signup?status=failed"
  );

  const oauthUrl =
    `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/google` +
    `?project=${projectId}` +
    `&success=${success}` +
    `&failure=${failure}`;

  res.writeHead(302, {
    Location: oauthUrl
  });
  res.end();
}
