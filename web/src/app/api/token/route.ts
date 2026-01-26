/**
 * JWT Token Generation API Route
 *
 * This endpoint generates a JWT token from the current NextAuth session.
 * The JWT token is used for authenticating API calls to the backend.
 *
 * Flow:
 * 1. User logs in via NextAuth (session cookie set)
 * 2. Frontend calls /api/token to get JWT
 * 3. JWT is stored in memory/localStorage
 * 4. API client uses JWT for backend calls
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/nextauth.config";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    // Verify JWT private key is configured
    const privateKeyBase64 = process.env.JWT_PRIVATE_KEY || "";
    if (!privateKeyBase64) {
      console.error("JWT_PRIVATE_KEY not configured in environment variables");
      return NextResponse.json(
        { error: "JWT authentication not configured" },
        { status: 500 }
      );
    }

    const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');

    // Get current session from NextAuth
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Generate JWT token with RS256
    const token = jwt.sign(
      {
        sub: session.user.id, // User ID in 'sub' claim (required by backend)
        email: session.user.email,
        name: session.user.name,
        iat: Math.floor(Date.now() / 1000), // Issued at
      },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "7d", // 7 days (matches session expiry)
      }
    );

    console.log(`✓ Generated JWT token for user: ${session.user.id}`);

    return NextResponse.json({
      token,
      type: "Bearer",
      expiresIn: 604800, // 7 days in seconds
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error) {
    console.error("Error generating JWT token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
