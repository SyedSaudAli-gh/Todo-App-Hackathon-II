#!/usr/bin/env python3
"""
Diagnostic script to check Better Auth database and sessions.
"""
import sqlite3
import os
from datetime import datetime

# Path to Better Auth database
DB_PATH = os.path.join(os.path.dirname(__file__), "../web/auth.db")

print(f"Checking Better Auth database at: {DB_PATH}")
print(f"Database exists: {os.path.exists(DB_PATH)}")
print()

if not os.path.exists(DB_PATH):
    print("ERROR: Database not found!")
    exit(1)

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # List all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in database:")
    for table in tables:
        print(f"  - {table[0]}")
    print()

    # Check session table
    if any('session' in str(t).lower() for t in tables):
        print("Session table found!")

        # Count sessions
        cursor.execute("SELECT COUNT(*) FROM session")
        count = cursor.fetchone()[0]
        print(f"Total sessions: {count}")

        # Show recent sessions (last 5)
        cursor.execute("""
            SELECT token, userId, expiresAt, createdAt
            FROM session
            ORDER BY createdAt DESC
            LIMIT 5
        """)
        sessions = cursor.fetchall()

        print("\nRecent sessions:")
        for session in sessions:
            token, user_id, expires_at, created_at = session
            print(f"  Token (first 8): {token[:8]}...")
            print(f"  User ID: {user_id}")
            print(f"  Expires: {expires_at}")
            print(f"  Created: {created_at}")

            # Check if expired
            try:
                expires_dt = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                now = datetime.now(expires_dt.tzinfo)
                is_expired = expires_dt < now
                print(f"  Status: {'EXPIRED' if is_expired else 'VALID'}")
            except:
                print(f"  Status: Unknown")
            print()
    else:
        print("WARNING: No session table found!")

    # Check user table
    if any('user' in str(t).lower() for t in tables):
        cursor.execute("SELECT COUNT(*) FROM user")
        user_count = cursor.fetchone()[0]
        print(f"Total users: {user_count}")

        if user_count > 0:
            cursor.execute("SELECT id, email, name, createdAt FROM user LIMIT 5")
            users = cursor.fetchall()
            print("\nRecent users:")
            for user in users:
                print(f"  ID: {user[0]}")
                print(f"  Email: {user[1]}")
                print(f"  Name: {user[2]}")
                print(f"  Created: {user[3]}")
                print()

    conn.close()

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
