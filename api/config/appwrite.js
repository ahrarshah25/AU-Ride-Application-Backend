import { Client, Account, Databases, Storage } from "appwrite";

export async function createAppwriteClient(req = null) {
  const projectId = process.env.PROJECT_ID;
  const endPoint = process.env.ENDPOINT;

  if (!projectId || !endPoint) {
    throw new Error("Missing environment variables: PROJECT_ID or ENDPOINT.");
  }

  const client = new Client();
  try {
    client.setEndpoint(endPoint).setProject(projectId);
  } catch (error) {
    console.error("Error initializing Appwrite Client:", error);
    throw new Error("Failed to initialize Appwrite client.");
  }

  if (req && req.headers && req.headers.cookie) {
    client.headers["cookie"] = req.headers.cookie;
  }

  try {
    const auth = new Account(client);
    const db = new Databases(client);
    const storage = new Storage(client);

    return { client, auth, db, storage };
  } catch (error) {
    console.error("Error initializing Appwrite services:", error);
    throw new Error("Failed to initialize Appwrite services.");
  }
}

// This line is the important part. If this is an entry point for an API or server,
// ensure you export a function, not just an object or config.
export default async (req, res) => {
  try {
    const { client, auth, db, storage } = await createAppwriteClient();
    // You can now use these in your API route logic
    res.status(200).json({ message: "Appwrite Client initialized successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};