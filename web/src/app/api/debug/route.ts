import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "❌ Missing",
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "✓ Set" : "❌ Missing",
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "❌ Missing",
        JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY ? "✓ Set" : "❌ Missing",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "❌ Missing",
        NODE_ENV: process.env.NODE_ENV,
      },
      database: {
        status: "checking...",
        error: null as string | null,
      },
    };

    // Test database connection
    if (process.env.DATABASE_URL) {
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 1,
          connectionTimeoutMillis: 5000,
        });

        const client = await pool.connect();

        // Test query to check if Better Auth tables exist
        const result = await client.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name IN ('user', 'session', 'account', 'verification')
          ORDER BY table_name
        `);

        diagnostics.database.status = "✓ Connected";
        diagnostics.database = {
          ...diagnostics.database,
          tables: result.rows.map(r => r.table_name),
          tableCount: result.rows.length,
        };

        client.release();
        await pool.end();
      } catch (dbError: any) {
        diagnostics.database.status = "❌ Failed";
        diagnostics.database.error = dbError.message;
      }
    } else {
      diagnostics.database.status = "❌ DATABASE_URL not set";
    }

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Diagnostic failed",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
