import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Simple auth signup");
    
    const body = await request.json();
    console.log("Signup request:", { email: body.email, name: body.name });
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not configured");
    }

    const { Client } = await import('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    await client.connect();
    
    // Simple user creation
    const userId = `user_${Date.now()}`;
    const insertQuery = `
      INSERT INTO "user" (id, email, name, "emailVerified", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, name
    `;
    
    const now = new Date().toISOString();
    const result = await client.query(insertQuery, [
      userId,
      body.email,
      body.name,
      false,
      now,
      now
    ]);

    await client.end();

    if (result.rows.length === 0) {
      return NextResponse.json({
        error: "User already exists"
      }, { status: 400 });
    }

    return NextResponse.json({
      user: result.rows[0],
      message: "User created successfully"
    });

  } catch (error) {
    console.error("❌ Simple signup error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}