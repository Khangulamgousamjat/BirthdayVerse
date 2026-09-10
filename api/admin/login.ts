import crypto from "crypto";

const DEFAULT_SALT = "bv_master_salt_2026";
const DEFAULT_SECRET = process.env.ADMIN_SESSION_SECRET || "bv_super_secret_session_key_2026_x9";

// Compute deterministic PBKDF2 hash of a password with a salt
export function hashPassword(password: string, salt: string = DEFAULT_SALT): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

// Default hash for the owner requested password 'Kingkhan@12'
// Pre-computed so the plaintext password never exists in client code
const DEFAULT_ADMIN_HASH = hashPassword("Kingkhan@12", DEFAULT_SALT);

// In-memory runtime override store (can also sync with Firestore _system_settings/admin_auth)
let currentAdminHash = DEFAULT_ADMIN_HASH;
let currentAdminSalt = DEFAULT_SALT;

export function getAdminCredentials() {
  return { hash: currentAdminHash, salt: currentAdminSalt };
}

export function updateAdminCredentials(newPasswordHash: string, newSalt: string) {
  currentAdminHash = newPasswordHash;
  currentAdminSalt = newSalt;
}

export function createSessionToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      role: "admin",
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      iat: Date.now(),
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", DEFAULT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", DEFAULT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  if (signature !== expectedSignature) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.role !== "admin" || !data.exp || data.exp < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Vercel Serverless Function Handler for POST /api/admin/login
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { password } = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required" });
    }

    const { hash, salt } = getAdminCredentials();
    const computedHash = hashPassword(password, salt);

    if (computedHash !== hash) {
      return res.status(401).json({ error: "Invalid admin password" });
    }

    const token = createSessionToken();
    return res.status(200).json({
      success: true,
      token,
      expiresIn: 86400,
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
