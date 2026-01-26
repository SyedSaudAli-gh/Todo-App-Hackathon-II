import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

console.log("🔍 Initializing Better Auth...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);
console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

export const auth = betterAuth({
  database: process.env.DATABASE_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "https://todo-app-hackathon-ii.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    facebook: {
      clientId: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
