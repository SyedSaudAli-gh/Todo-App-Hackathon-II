import { betterAuth } from "better-auth";
import { Pool } from "pg";

console.log("🔍 Better Auth initialization with explicit pg adapter...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);

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
