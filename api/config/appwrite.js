import { Client, Account, Databases, Storage } from "appwrite";

export function createAppwriteClient(req = null) {
  const projectId = process.env.PROJECT_ID;
  const endPoint = process.env.ENDPOINT;

  if (!projectId || !endPoint) {
    throw new Error("Missing environment variables");
  }

  const client = new Client();
  client.setEndpoint(endPoint).setProject(projectId);

  // session cookie forward
  if (req?.headers?.cookie) {
    client.headers["cookie"] = req.headers.cookie;
  }

  const auth = new Account(client);
  const db = new Databases(client);
  const storage = new Storage(client);

  return { client, auth, db, storage };
}
