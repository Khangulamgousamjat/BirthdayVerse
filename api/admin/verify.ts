import { verifySessionToken } from "./login";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : req.body?.token || req.query?.token;

    if (!token || !verifySessionToken(token)) {
      return res.status(401).json({ authenticated: false, error: "Invalid or expired session" });
    }

    return res.status(200).json({ authenticated: true });
  } catch (error: any) {
    return res.status(500).json({ authenticated: false, error: "Verification failed" });
  }
}
