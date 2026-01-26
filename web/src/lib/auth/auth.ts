import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

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

// Validate required environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

console.log("Environment variables check:");
for (const [key, value] of Object.entries(requiredEnvVars)) {
  console.log(`  ${key}: ${value ? '✓' : '❌ MISSING'}`);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Create Kysely database instance with PostgreSQL dialect
// Better Auth requires Kysely for proper database operations
// Using Session Pooler configuration for Supabase
const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }),
  }),
});

export const auth = betterAuth({
  database: db,
  trustedOrigins: [
    "http://localhost:3000",
    "https://todo-app-hackathon-ii.vercel.app",
  ],
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
