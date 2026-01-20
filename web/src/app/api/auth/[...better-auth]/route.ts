import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const handler = toNextJsHandler(auth);


interface User {
  id: number;
  email: string;
  name: string;
  password?: string;    // Optional: may not exist
  providerId?: string;  // Optional: may not exist
}

export async function GET(request: NextRequest) {
  return handler.GET(request);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // COMPREHENSIVE AUTH TRACE LOGGING
  const clonedRequest = request.clone();
  let body: any = null;

  try {
    body = await clonedRequest.json();

    console.log("\n" + "=".repeat(80));
    console.log("🔐 BETTER AUTH REQUEST TRACE");
    console.log("=".repeat(80));
    console.log("Timestamp:", new Date().toISOString());
    console.log("URL:", request.url);
    console.log("Pathname:", pathname);
    console.log("Method:", request.method);

    // Determine operation type
    const isSignup = pathname.includes("sign-up");
    const isSignin = pathname.includes("sign-in");

    if (isSignup) {
      console.log("\n📝 SIGNUP REQUEST");
      console.log("-".repeat(80));
      console.log("Body keys:", Object.keys(body));
      console.log("Email:", body.email);
      console.log("Name:", body.name);
      console.log("Password length:", body.password?.length || 0);
      console.log("Password exists:", !!body.password);
      console.log("Password type:", typeof body.password);
    } else if (isSignin) {
      console.log("\n🔑 SIGNIN REQUEST");
      console.log("-".repeat(80));
      console.log("Body keys:", Object.keys(body));
      console.log("Email:", body.email);
      console.log("Password length:", body.password?.length || 0);
      console.log("Password exists:", !!body.password);
      console.log("Password type:", typeof body.password);

      // CHECK DATABASE FOR THIS USER
      try {
        const dbPath = path.join(process.cwd(), "auth.db");
        const db = new Database(dbPath);

        const user = db.prepare(`
          SELECT u.id, u.email, u.name, a.password, a.providerId
          FROM user u
          LEFT JOIN account a ON u.id = a.userId
          WHERE u.email = ?
        `).get(body.email) as User | undefined;

        console.log("\n📊 DATABASE CHECK FOR USER");
        console.log("-".repeat(80));
        if (user) {
          console.log("✅ User found in database");
          console.log("User ID:", user.id);
          console.log("User email:", user.email);
          console.log("User name:", user.name);
          console.log("Provider ID:", user.providerId);
          console.log("Hashed password exists:", !!user.password);
          console.log("Hashed password length:", user.password?.length || 0);

          if (user.password) {
            const parts = user.password.split(':');
            console.log("Password format:", parts.length === 2 ? "salt:hash (CORRECT)" : "INVALID FORMAT");
            if (parts.length === 2) {
              console.log("Salt length:", parts[0].length);
              console.log("Hash length:", parts[1].length);
            }
          } else {
            console.log("❌ WARNING: No password stored for this user!");
          }
        } else {
          console.log("❌ User NOT found in database");
          console.log("Email searched:", body.email);
        }

        db.close();
      } catch (dbError) {
        console.log("❌ Database check failed:", dbError);
      }
    }

    console.log("=".repeat(80) + "\n");
  } catch (e) {
    console.log("❌ Could not parse request body:", e);
  }

  // Call Better Auth handler
  const response = await handler.POST(request);

  // LOG RESPONSE
  const clonedResponse = response.clone();
  try {
    const responseBody = await clonedResponse.json();

    console.log("\n" + "=".repeat(80));
    console.log("📤 BETTER AUTH RESPONSE");
    console.log("=".repeat(80));
    console.log("Status:", response.status);
    console.log("Status text:", response.statusText);

    if (response.status === 200) {
      console.log("✅ SUCCESS");
      if (responseBody.user) {
        console.log("User ID:", responseBody.user.id);
        console.log("User email:", responseBody.user.email);
        console.log("User name:", responseBody.user.name);
      }
      if (responseBody.token) {
        console.log("Token:", responseBody.token.substring(0, 20) + "...");
      }
    } else {
      console.log("❌ FAILED");
      console.log("Error code:", responseBody.code);
      console.log("Error message:", responseBody.message);
    }

    console.log("\nFull response:", JSON.stringify(responseBody, null, 2));
    console.log("=".repeat(80) + "\n");
  } catch (e) {
    console.log("Could not parse response body");
  }

  return response;
}
