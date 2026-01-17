"""
Data migration script to populate user_id for existing todos.

This script assigns all existing todos (with NULL user_id) to the first user
in the Better Auth database.
"""
import sqlite3
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URLs
POSTGRES_URL = os.getenv("DATABASE_URL")
BETTER_AUTH_DB = os.path.join(os.path.dirname(__file__), "../web/auth.db")

print("=" * 60)
print("Data Migration: Populate user_id for existing todos")
print("=" * 60)
print()

# Step 1: Get the first user from Better Auth database
print("Step 1: Getting user from Better Auth database...")
try:
    conn = sqlite3.connect(BETTER_AUTH_DB)
    cursor = conn.cursor()

    cursor.execute("SELECT id, email, name FROM user LIMIT 1")
    user = cursor.fetchone()

    if not user:
        print("ERROR: No users found in Better Auth database!")
        print("Please create a user account first.")
        exit(1)

    user_id, email, name = user
    print(f"✓ Found user: {name} ({email})")
    print(f"  User ID: {user_id}")
    print()

    conn.close()
except Exception as e:
    print(f"ERROR accessing Better Auth database: {e}")
    exit(1)

# Step 2: Update todos in PostgreSQL database
print("Step 2: Updating todos in PostgreSQL database...")
try:
    engine = create_engine(POSTGRES_URL)

    with engine.connect() as connection:
        # Check how many todos have NULL user_id
        result = connection.execute(text("SELECT COUNT(*) FROM todos WHERE user_id IS NULL"))
        null_count = result.scalar()

        print(f"Found {null_count} todos with NULL user_id")

        if null_count == 0:
            print("✓ All todos already have user_id assigned!")
            print()
        else:
            # Update todos with NULL user_id
            result = connection.execute(
                text("UPDATE todos SET user_id = :user_id WHERE user_id IS NULL"),
                {"user_id": user_id}
            )
            connection.commit()

            print(f"✓ Updated {result.rowcount} todos with user_id: {user_id}")
            print()

        # Verify the update
        result = connection.execute(text("SELECT COUNT(*) FROM todos WHERE user_id IS NULL"))
        remaining_null = result.scalar()

        result = connection.execute(text("SELECT COUNT(*) FROM todos WHERE user_id = :user_id"), {"user_id": user_id})
        assigned_count = result.scalar()

        print("Verification:")
        print(f"  Todos with NULL user_id: {remaining_null}")
        print(f"  Todos assigned to {name}: {assigned_count}")
        print()

except Exception as e:
    print(f"ERROR updating PostgreSQL database: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

print("=" * 60)
print("Migration completed successfully!")
print("=" * 60)
print()
print("Next steps:")
print("1. Verify user is logged in at http://localhost:3000")
print("2. Check session cookie in browser DevTools")
print("3. Test /api/v1/users/me/stats endpoint")
