import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 GET request to auth endpoint:", request.url);
    return handler.GET(request);
  } catch (error) {
    console.error("❌ GET handler error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST request to auth endpoint:", request.url);
    const response = await handler.POST(request);
    console.log("✅ POST response status:", response.status);
    return response;
  } catch (error) {
    console.error("❌ POST handler error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}