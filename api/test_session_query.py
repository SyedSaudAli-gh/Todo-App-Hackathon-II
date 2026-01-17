#!/usr/bin/env python3
"""
Test the exact SQL query used by the auth middleware.
"""
import sqlite3
import os

# Path to Better Auth database
DB_PATH = os.path.join(os.path.dirname(__file__), "../web/auth.db")

# Test token from logs
TEST_TOKEN = "xSufCMuR"  # First 8 chars from logs

print(f"Testing session lookup in: {DB_PATH}")
print(f"Looking for token starting with: {TEST_TOKEN}")
print()

try:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # First, get all tokens to see what's in the database
    print("All tokens in database:")
    cursor.execute("SELECT token FROM session")
    all_tokens = cursor.fetchall()
    for row in all_tokens:
        token = row[0]
        print(f"  Token (first 8): {token[:8]}... (length: {len(token)})")
        print(f"  Full token: {token}")
    print()

    # Now try the exact query from auth middleware
    print("Testing exact query from auth middleware:")
    cursor.execute("""
        SELECT s.userId, s.expiresAt, u.createdAt
        FROM session s
        JOIN user u ON s.userId = u.id
        WHERE s.token = ?
    """, (TEST_TOKEN,))

    result = cursor.fetchone()
    print(f"Result for partial token '{TEST_TOKEN}': {result}")
    print()

    # Try with LIKE pattern
    print("Testing with LIKE pattern:")
    cursor.execute("""
        SELECT s.token, s.userId, s.expiresAt, u.createdAt
        FROM session s
        JOIN user u ON s.userId = u.id
        WHERE s.token LIKE ?
    """, (f"{TEST_TOKEN}%",))

    results = cursor.fetchall()
    print(f"Found {len(results)} results")
    for row in results:
        print(f"  Token: {row[0]}")
        print(f"  User ID: {row[1]}")
        print(f"  Expires: {row[2]}")
        print(f"  Created: {row[3]}")
    print()

    # Get the full token and test exact match
    if results:
        full_token = results[0][0]
        print(f"Testing exact match with full token:")
        print(f"Full token: {full_token}")

        cursor.execute("""
            SELECT s.userId, s.expiresAt, u.createdAt
            FROM session s
            JOIN user u ON s.userId = u.id
            WHERE s.token = ?
        """, (full_token,))

        exact_result = cursor.fetchone()
        print(f"Exact match result: {exact_result}")

    conn.close()

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
