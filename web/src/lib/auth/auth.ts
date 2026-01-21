import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "auth.db");

/**
 * Load RSA private key for JWT signing from environment variable.
 *
 * The private key should be stored in JWT_PRIVATE_KEY environment variable.
 * If the key contains literal \n strings (common when copying from .env files),
 * they will be converted to actual newlines.
 *
 * This function is lazy-loaded and only called when JWT tokens are needed.
 * Better Auth itself works with cookies and doesn't require JWT.
 *
 * @throws Error if JWT_PRIVATE_KEY is not set or invalid
 */
export function loadPrivateKey(): string {
  const rawKey = process.env.JWT_PRIVATE_KEY;

  if (!rawKey) {
    throw new Error(
      "JWT_PRIVATE_KEY environment variable is not set. " +
      "This is required for generating JWT tokens for backend API authentication. " +
      "Generate one with: openssl genrsa -out private_key.pem 2048\n" +
      "Then add to .env.local: JWT_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\""
    );
  }

  // Convert literal \n to actual newlines (common issue with .env files)
  const privateKey = rawKey.replace(/\\n/g, "\n");

  // Basic validation: check if it looks like a PEM key
  if (!privateKey.includes("BEGIN") || !privateKey.includes("PRIVATE KEY")) {
    throw new Error(
      "JWT_PRIVATE_KEY does not appear to be a valid PEM-formatted private key. " +
      "It should start with '-----BEGIN PRIVATE KEY-----' or '-----BEGIN RSA PRIVATE KEY-----'"
    );
  }

  console.log("✓ Loaded RSA private key for JWT signing from environment variable");
  return privateKey;
}

// Better Auth configuration
// Note: JWT is NOT required for Better Auth to work - it uses cookie-based sessions
export const auth = betterAuth({
  database: new Database(dbPath),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
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
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;
