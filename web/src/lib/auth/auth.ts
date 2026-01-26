import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

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
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

console.log("Environment variables check:");
for (const [key, value] of Object.entries(requiredEnvVars)) {
  console.log(`  ${key}: ${value ? '✓' : '❌ MISSING'}`);
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is required");
}

export const auth = betterAuth({
  database: process.env.DATABASE_URL || "file:auth.db",
  trustedOrigins: [
    "http://localhost:3000",
    "https://todo-app-hackathon-ii.vercel.app",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean),
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
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,
    },
    facebook: {
      clientId: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      enabled: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
      redirectURI: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/callback/facebook`,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development-only",
  baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  // Add error handling for production
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined,
    },
  },
});

export type Session = typeof auth.$Infer.Session;

// Export private key for JWT generation in API routes
export { privateKey };
