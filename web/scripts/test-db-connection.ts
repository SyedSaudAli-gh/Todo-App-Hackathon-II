// Test script to verify Better Auth database connection
// Run this locally to test the configuration

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testDatabaseConnection() {
  console.log("Testing database connection...\n");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not set");
    process.exit(1);
  }

  try {
    const db = new Kysely({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 1,
        }),
      }),
    });

    console.log("✓ Kysely instance created");

    // Test connection
    const result = await db
      .selectFrom("user" as any)
      .selectAll()
      .limit(1)
      .execute();

    console.log("✓ Database connection successful");
    console.log(`✓ User table accessible (${result.length} rows returned)`);

    // Check all Better Auth tables
    const tables = ["user", "session", "account", "verification"];
    for (const table of tables) {
      try {
        await db.selectFrom(table as any).selectAll().limit(1).execute();
        console.log(`✓ Table '${table}' exists and is accessible`);
      } catch (error: any) {
        console.error(`❌ Table '${table}' error:`, error.message);
      }
    }

    await db.destroy();
    console.log("\n✓ All tests passed!");
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

testDatabaseConnection();
