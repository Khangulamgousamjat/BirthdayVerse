import { 
  verifySessionToken, 
  getAdminCredentials, 
  hashPassword, 
  updateAdminCredentials, 
  createSessionToken 
} from "./login";
import crypto from "crypto";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers?.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";

    if (!token || !verifySessionToken(token)) {
      return res.status(401).json({ error: "Unauthorized: Invalid admin session" });
    }

    const { currentPassword, newPassword, confirmPassword } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New password and confirmation do not match" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters long" });
    }

    const { hash, salt } = getAdminCredentials();
    const currentHash = hashPassword(currentPassword, salt);

    if (currentHash !== hash) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Generate fresh salt and new hash
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newHash = hashPassword(newPassword, newSalt);

    updateAdminCredentials(newHash, newSalt);

    // Issue new session token
    const newToken = createSessionToken();

    return res.status(200).json({
      success: true,
      message: "Admin password updated successfully",
      token: newToken,
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "Failed to update password" });
  }
}
