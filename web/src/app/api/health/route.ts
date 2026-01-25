import { NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    env_check: {},
    db_check: {},
  };

  // Check environment variables
  results.env_check = {
    DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? "SET" : "MISSING",
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "MISSING",
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY ? "SET" : "MISSING",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "MISSING",
  };

  // Test database connection
  if (!process.env.DATABASE_URL) {
    results.db_check.error = "DATABASE_URL not set";
    return NextResponse.json(results, { status: 500 });
  }

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1,
      connectionTimeoutMillis: 10000,
    });

    const client = await pool.connect();
    results.db_check.connection = "SUCCESS";

    // Check for Better Auth tables
    const tableCheck = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('user', 'session', 'account', 'verification')
      ORDER BY table_name
    `);

    results.db_check.tables_found = tableCheck.rows.map(r => r.table_name);
    results.db_check.tables_count = tableCheck.rows.length;
    results.db_check.all_tables_exist = tableCheck.rows.length === 4;

    // Check user table structure if it exists
    if (tableCheck.rows.some(r => r.table_name === 'user')) {
      const userColumns = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user'
        ORDER BY ordinal_position
      `);
      results.db_check.user_table_columns = userColumns.rows;
    }

    client.release();
    await pool.end();

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    results.db_check.error = error.message;
    results.db_check.stack = error.stack;
    return NextResponse.json(results, { status: 500 });
  }
}
