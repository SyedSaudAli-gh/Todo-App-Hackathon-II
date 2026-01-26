import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Testing environment variables...");
    
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30),
      BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      FACEBOOK_APP_ID: !!process.env.FACEBOOK_APP_ID,
    };
    
    console.log("Environment check:", envCheck);
    
    // Test basic database connection
    if (process.env.DATABASE_URL) {
      const { Client } = await import('pg');
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
      });
      
      try {
        await client.connect();
        await client.query('SELECT 1');
        await client.end();
        console.log("✅ Database connection successful");
        
        return NextResponse.json({
          success: true,
          message: "All checks passed",
          environment: envCheck,
          database: "Connected successfully"
        });
      } catch (dbError) {
        console.error("❌ Database connection failed:", dbError);
        return NextResponse.json({
          success: false,
          message: "Database connection failed",
          environment: envCheck,
          database: dbError instanceof Error ? dbError.message : "Unknown database error"
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "DATABASE_URL not found",
        environment: envCheck,
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("❌ Test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}