import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { Pool } from "pg";
import PostgresAdapter from "@auth/pg-adapter";
import bcrypt from "bcryptjs";

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

console.log("🔌 Initializing NextAuth with database connection...");

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("❌ Missing credentials");
          throw new Error("Email and password required");
        }

        try {
          const email = credentials.email as string;
          const password = credentials.password as string;

          console.log("🔍 Login attempt for:", email);

          // Query user from database
          const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
          );

          const user = result.rows[0];

          if (!user || !user.password) {
            console.error("❌ User not found or no password:", email);
            throw new Error("Invalid email or password");
          }

          console.log("✅ User found:", email);

          // Verify password with bcrypt
          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            console.error("❌ Password mismatch for:", email);
            throw new Error("Invalid email or password");
          }

          console.log("✅ Password correct, logging in:", email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});

console.log("✅ NextAuth initialized with database adapter");
