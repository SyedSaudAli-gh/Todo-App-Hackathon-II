import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "auth.db");

// Load RSA private key for JWT signing from environment variable
// The key is stored as base64-encoded string to avoid newline issues in env vars
const privateKeyBase64 = process.env.JWT_PRIVATE_KEY || "";

let privateKey = "";
if (privateKeyBase64) {
  try {
    // Decode base64 to get the PEM-formatted private key
    privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
    console.log("✓ JWT_PRIVATE_KEY loaded and decoded from environment variable");
  } catch (error) {
    console.error("❌ Failed to decode JWT_PRIVATE_KEY:", error);
  }
} else {
  console.warn("⚠ JWT_PRIVATE_KEY not configured. JWT token generation will fail.");
  console.warn("⚠ Set JWT_PRIVATE_KEY in .env.local to enable JWT authentication.");
}

export const auth = betterAuth({
  database: new Database(dbPath),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    // Explicitly configure password requirements
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    facebook: {
      clientId: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      enabled: !!process.env.FACEBOOK_APP_ID,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      enabled: !!process.env.LINKEDIN_CLIENT_ID,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [nextCookies()],
  // Session configuration - cookies for UI
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;

// Export private key for JWT generation in API routes
export { privateKey };
