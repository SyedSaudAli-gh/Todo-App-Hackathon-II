import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Simple auth session check");
    
    // For now, return a simple session response
    return NextResponse.json({
      user: null,
      session: null,
      message: "Simple auth working"
    });
    
  } catch (error) {
    console.error("❌ Simple auth error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}