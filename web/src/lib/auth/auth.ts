import { betterAuth } from "better-auth";
import { Pool } from "pg";

console.log("🔍 Better Auth initialization with explicit pg adapter...");

// Create pg Pool explicitly for Better Auth
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
  },
});

export type Session = typeof auth.$Infer.Session;
