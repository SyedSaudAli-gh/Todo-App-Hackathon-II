import { betterAuth } from "better-auth";

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

// Simplest possible Better Auth configuration
export const auth = betterAuth({
  database: process.env.DATABASE_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
  },
});

export type Session = typeof auth.$Infer.Session;
export { privateKey };
