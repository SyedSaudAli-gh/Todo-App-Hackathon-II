import { betterAuth } from "better-auth";
import { Pool } from "pg";

console.log("🔍 Auth module loaded");

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

// Lazy initialization - only create auth instance when first accessed
let authInstance: ReturnType<typeof betterAuth> | null = null;

function getAuth() {
  if (authInstance) {
    return authInstance;
  }

  console.log("🔍 Initializing Better Auth (lazy)...");
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);

  // Create pg Pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });

  authInstance = betterAuth({
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET!,
    emailAndPassword: {
      enabled: true,
    },
  });

  console.log("✅ Better Auth initialized successfully");
  return authInstance;
}

// Export a proxy that lazily initializes
export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(target, prop) {
    const instance = getAuth();
    return (instance as any)[prop];
  }
});

export type Session = ReturnType<typeof betterAuth>['$Infer']['Session'];

// Export private key for JWT generation in API routes
export { privateKey };
