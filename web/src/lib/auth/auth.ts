import { betterAuth } from "better-auth";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

// Load RSA private key for JWT signing
const privateKeyBase64 = process.env.JWT_PRIVATE_KEY || "";
let privateKey = "";
if (privateKeyBase64) {
  try {
    privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
  } catch (error) {
    console.error("Failed to decode JWT_PRIVATE_KEY:", error);
  }
}

// Create Kysely database instance - Better Auth v1.4.17 requires this
const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL!,
    }),
  }),
});

console.log("🔍 Initializing Better Auth with Kysely...");

try {
  // Better Auth configuration with Kysely instance
  var auth = betterAuth({
    database: db,
    secret: process.env.BETTER_AUTH_SECRET!,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
  });
  console.log("✅ Better Auth initialized successfully");
} catch (error) {
  console.error("❌ Better Auth initialization failed:", error);
  throw error;
}

export { auth };
export type Session = typeof auth.$Infer.Session;
export { privateKey };
