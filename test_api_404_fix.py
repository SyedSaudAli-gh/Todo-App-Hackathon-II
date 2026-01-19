#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
API 404 Fix Verification Test

Verifies that the endpoint path fix resolves all 404 errors
and all CRUD operations work correctly.
"""

import sys
import requests
import jwt
import time

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Configuration
FRONTEND_URL = "http://localhost:3004"  # Adjusted for actual port
BACKEND_URL = "http://localhost:8001"
PRIVATE_KEY_PATH = "web/private_key.pem"

# Load RSA private key for JWT signing
try:
    with open(PRIVATE_KEY_PATH, 'r') as f:
        PRIVATE_KEY = f.read()
    print("[OK] Loaded RSA private key")
except FileNotFoundError:
    print("[ERROR] private_key.pem not found")
    exit(1)

def create_jwt_token(user_id: str) -> str:
    """Create a JWT token for testing."""
    payload = {
        "sub": user_id,
        "iat": int(time.time()),
        "exp": int(time.time()) + 3600,
    }
    return jwt.encode(payload, PRIVATE_KEY, algorithm="RS256")

def print_section(title):
    print("\n" + "="*70)
    print(title)
    print("="*70)

def test_list_todos(token):
    """T004-T006: Test loading todos (User Story 1)"""
    print_section("TEST: User Story 1 - Load Existing Todos")

    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BACKEND_URL}/api/tasks", headers=headers)

    if response.status_code == 200:
        data = response.json()
        print(f"[OK] GET /api/tasks returned 200")
        print(f"   Total todos: {data.get('total', 0)}")
        print(f"   JWT token attached: YES")
        return True, data.get('todos', [])
    else:
        print(f"[FAIL] GET /api/tasks returned {response.status_code}")
        print(f"   Response: {response.text}")
        return False, []

def test_create_todo(token):
    """T007-T009: Test creating todos (User Story 2)"""
    print_section("TEST: User Story 2 - Create New Todo")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "title": f"Verification Test Todo - {int(time.time())}",
        "description": "Created to verify API 404 fix"
    }

    response = requests.post(
        f"{BACKEND_URL}/api/tasks",
        headers=headers,
        json=payload
    )

    if response.status_code == 201:
        data = response.json()
        print(f"[OK] POST /api/tasks returned 201")
        print(f"   Todo ID: {data.get('id')}")
        print(f"   Title: {data.get('title')}")
        return True, data.get('id')
    else:
        print(f"[FAIL] POST /api/tasks returned {response.status_code}")
        print(f"   Response: {response.text}")
        return False, None

def test_update_todo(token, todo_id):
    """T010-T011: Test updating todos (User Story 3)"""
    print_section("TEST: User Story 3 - Update Existing Todo")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {"completed": True}

    response = requests.patch(
        f"{BACKEND_URL}/api/tasks/{todo_id}",
        headers=headers,
        json=payload
    )

    if response.status_code == 200:
        data = response.json()
        print(f"[OK] PATCH /api/tasks/{todo_id} returned 200")
        print(f"   Completed: {data.get('completed')}")
        return True
    else:
        print(f"[FAIL] PATCH /api/tasks/{todo_id} returned {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def test_delete_todo(token, todo_id):
    """T012-T013: Test deleting todos (User Story 4)"""
    print_section("TEST: User Story 4 - Delete Todo")

    headers = {"Authorization": f"Bearer {token}"}

    response = requests.delete(
        f"{BACKEND_URL}/api/tasks/{todo_id}",
        headers=headers
    )

    if response.status_code == 204:
        print(f"[OK] DELETE /api/tasks/{todo_id} returned 204")
        print(f"   Todo deleted successfully")
        return True
    else:
        print(f"[FAIL] DELETE /api/tasks/{todo_id} returned {response.status_code}")
        print(f"   Response: {response.text}")
        return False

def main():
    print("\n" + "="*70)
    print("API 404 FIX VERIFICATION TEST")
    print("="*70)
    print(f"Frontend: {FRONTEND_URL}")
    print(f"Backend: {BACKEND_URL}")
    print(f"Test Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")

    # Create test user token
    user_id = f"test-user-{int(time.time())}"
    token = create_jwt_token(user_id)
    print(f"\n[OK] Generated JWT token for user: {user_id[:20]}...")

    results = []

    # Test 1: List todos (US1)
    success, todos = test_list_todos(token)
    results.append(("US1: Load Todos", success))

    # Test 2: Create todo (US2)
    success, todo_id = test_create_todo(token)
    results.append(("US2: Create Todo", success))

    if not success or not todo_id:
        print("\n[ABORT] Cannot proceed without successful todo creation")
        return 1

    # Test 3: Update todo (US3)
    success = test_update_todo(token, todo_id)
    results.append(("US3: Update Todo", success))

    # Test 4: Delete todo (US4)
    success = test_delete_todo(token, todo_id)
    results.append(("US4: Delete Todo", success))

    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)

    for test_name, passed in results:
        status = "[OK] PASS" if passed else "[FAIL] FAIL"
        print(f"{status}: {test_name}")

    total = len(results)
    passed = sum(1 for _, p in results if p)

    print("\n" + "="*70)
    print(f"TOTAL: {passed}/{total} tests passed")
    print("="*70)

    if passed == total:
        print("\n[SUCCESS] All CRUD operations work! API 404 fix verified.")
        print("\nKey Findings:")
        print("- All endpoints use /api/tasks (not /api/todos)")
        print("- JWT authentication working correctly")
        print("- No 404 errors observed")
        print("- All user stories satisfied")
        return 0
    else:
        print(f"\n[WARNING] {total - passed} test(s) failed.")
        return 1

if __name__ == "__main__":
    exit(main())
