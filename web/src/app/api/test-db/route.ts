import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing database connection...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20));
    
    // Test if we can import the auth module
    const { auth } = await import("@/lib/auth/auth");
    console.log("✅ Auth module imported successfully");
    
    return NextResponse.json({
      success: true,
      message: "Database connection test",
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20),
      authModuleLoaded: !!auth,
    });
  } catch (error) {
    console.error("❌ Database test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}