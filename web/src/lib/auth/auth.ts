import { betterAuth } from "better-auth";
import { Pool } from "pg";

console.log("🔍 Better Auth initialization with explicit pg adapter...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);

// Load RSA private key for JWT signing from environment variable
const privateKeyBase64 = process.env.JWT_PRIVATE_KEY || "";

let privateKey = "";
if (privateKeyBase64) {
  try {
    privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
    console.log("✓ JWT_PRIVATE_KEY loaded");
  } catch (error) {
    console.error("❌ Failed to decode JWT_PRIVATE_KEY:", error);
  }
}

// Create pg Pool explicitly for Better Auth
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Test pool connection before passing to Better Auth
pool.query('SELECT 1').then(() => {
  console.log("✅ Pool connection test successful");
}).catch((err) => {
  console.error("❌ Pool connection test failed:", err);
});

console.log("Initializing Better Auth...");

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
  },
});

console.log("✅ Better Auth initialized successfully");

export type Session = typeof auth.$Infer.Session;

// Export private key for JWT generation in API routes
export { privateKey };
