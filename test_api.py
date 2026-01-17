"""
Test script to verify chunked cookie reassembly in the backend.

This script simulates a browser sending chunked cookies to test
if the backend correctly reassembles them.
"""
import sys
import io
import requests
import json

# Fix Unicode encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Backend URL
BASE_URL = "http://localhost:8001/api/v1"

# Simulate chunked cookies (like Better Auth sends)
# This is the actual token from the database: X8qSufjFtHJvqslBtuS0bqQKg7TPQZhh
CHUNKED_COOKIES = {
    "better-auth.session_token": "X8qSufjF",  # First 8 chars
    "better-auth.session_token.0": "tHJvqslBtuS0bqQKg7TPQZhh"  # Remaining 24 chars
}

FULL_TOKEN = "X8qSufjFtHJvqslBtuS0bqQKg7TPQZhh"

def test_health():
    """Test health endpoint (no auth required)"""
    print("\n" + "="*60)
    print("TEST 1: Health Check (No Auth)")
    print("="*60)

    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, "Health check failed"
    print("[PASSED]")
    return True

def test_debug_cookies():
    """Test debug cookies endpoint with chunked cookies"""
    print("\n" + "="*60)
    print("TEST 2: Debug Cookies (With Chunked Cookies)")
    print("="*60)

    response = requests.get(f"{BASE_URL}/debug/cookies", cookies=CHUNKED_COOKIES)
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Total cookies received: {data['total_cookies']}")
    print(f"Cookies: {json.dumps(data['cookies'], indent=2)}")

    assert response.status_code == 200, "Debug cookies failed"
    assert data['total_cookies'] == 2, f"Expected 2 cookies, got {data['total_cookies']}"
    print("[PASSED]")
    return True

def test_user_stats_with_chunked_cookies():
    """Test user stats endpoint with chunked cookies"""
    print("\n" + "="*60)
    print("TEST 3: User Stats (With Chunked Cookies)")
    print("="*60)
    print(f"Sending chunked cookies:")
    print(f"  - better-auth.session_token: {CHUNKED_COOKIES['better-auth.session_token']}")
    print(f"  - better-auth.session_token.0: {CHUNKED_COOKIES['better-auth.session_token.0']}")
    print(f"Expected reassembled token: {FULL_TOKEN}")

    response = requests.get(f"{BASE_URL}/users/me/stats", cookies=CHUNKED_COOKIES)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        print("[PASSED] - Authentication successful with chunked cookies!")
        return True
    else:
        print(f"Response: {response.json()}")
        print("[FAILED] - Authentication failed")
        print("\nBackend should show in logs:")
        print("  - Reassembled cookie 'better-auth.session_token': 2 chunk(s), total length: 32")
        print("  - Session validated successfully")
        return False

def test_list_todos_with_chunked_cookies():
    """Test list todos endpoint with chunked cookies"""
    print("\n" + "="*60)
    print("TEST 4: List Todos (With Chunked Cookies)")
    print("="*60)

    response = requests.get(f"{BASE_URL}/todos", cookies=CHUNKED_COOKIES)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"Total todos: {data['total']}")
        print(f"Response: {json.dumps(data, indent=2)}")
        print("[PASSED]")
        return True
    else:
        print(f"Response: {response.json()}")
        print("[FAILED]")
        return False

def test_create_todo_with_chunked_cookies():
    """Test create todo endpoint with chunked cookies"""
    print("\n" + "="*60)
    print("TEST 5: Create Todo (With Chunked Cookies)")
    print("="*60)

    todo_data = {
        "title": "Test Todo from Script",
        "description": "Testing chunked cookie authentication"
    }

    response = requests.post(
        f"{BASE_URL}/todos",
        json=todo_data,
        cookies=CHUNKED_COOKIES
    )
    print(f"Status: {response.status_code}")

    if response.status_code == 201:
        data = response.json()
        print(f"Created todo: {json.dumps(data, indent=2)}")
        print("✅ PASSED")
        return True, data.get('id')
    else:
        print(f"Response: {response.json()}")
        print("❌ FAILED")
        return False, None

def test_update_todo_with_chunked_cookies(todo_id):
    """Test update todo endpoint with chunked cookies"""
    print("\n" + "="*60)
    print(f"TEST 6: Update Todo (ID: {todo_id})")
    print("="*60)

    if not todo_id:
        print("[SKIPPED] - No todo ID available")
        return False

    update_data = {
        "title": "Updated Test Todo",
        "completed": True
    }

    response = requests.patch(
        f"{BASE_URL}/todos/{todo_id}",
        json=update_data,
        cookies=CHUNKED_COOKIES
    )
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print(f"Updated todo: {json.dumps(data, indent=2)}")
        print("[PASSED]")
        return True
    else:
        print(f"Response: {response.json()}")
        print("[FAILED]")
        return False

def test_delete_todo_with_chunked_cookies(todo_id):
    """Test delete todo endpoint with chunked cookies"""
    print("\n" + "="*60)
    print(f"TEST 7: Delete Todo (ID: {todo_id})")
    print("="*60)

    if not todo_id:
        print("[SKIPPED] - No todo ID available")
        return False

    response = requests.delete(
        f"{BASE_URL}/todos/{todo_id}",
        cookies=CHUNKED_COOKIES
    )
    print(f"Status: {response.status_code}")

    if response.status_code == 204:
        print("Todo deleted successfully")
        print("[PASSED]")
        return True
    else:
        print(f"Response: {response.json()}")
        print("[FAILED]")
        return False

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("API ENDPOINTS TESTING")
    print("Testing chunked cookie reassembly")
    print("="*60)

    results = {
        "passed": 0,
        "failed": 0,
        "skipped": 0
    }

    try:
        # Test 1: Health check
        if test_health():
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        print(f"[ERROR]: {e}")
        results["failed"] += 1

    try:
        # Test 2: Debug cookies
        if test_debug_cookies():
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        print(f"[ERROR]: {e}")
        results["failed"] += 1

    try:
        # Test 3: User stats (auth required)
        if test_user_stats_with_chunked_cookies():
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        print(f"[ERROR]: {e}")
        results["failed"] += 1

    try:
        # Test 4: List todos (auth required)
        if test_list_todos_with_chunked_cookies():
            results["passed"] += 1
        else:
            results["failed"] += 1
    except Exception as e:
        print(f"[ERROR]: {e}")
        results["failed"] += 1

    todo_id = None
    try:
        # Test 5: Create todo (auth required)
        success, created_id = test_create_todo_with_chunked_cookies()
        if success:
            results["passed"] += 1
            todo_id = created_id  # Store the ID for subsequent tests
        else:
            results["failed"] += 1
    except Exception as e:
        print(f"[ERROR]: {e}")
        results["failed"] += 1

    try:
        # Test 6: Update todo (auth required)
        if test_update_todo_with_chunked_cookies(todo_id):
            results["passed"] += 1
        else:
            if todo_id:
                results["failed"] += 1
            else:
                results["skipped"] += 1
    except Exception as e:
        print(f"[ERROR]: {e}")
        results["failed"] += 1

    try:
        # Test 7: Delete todo (auth required)
        if test_delete_todo_with_chunked_cookies(todo_id):
            results["passed"] += 1
        else:
            if todo_id:
                results["failed"] += 1
            else:
                results["skipped"] += 1
    except Exception as e:
        print(f"[ERROR]: {e}")
        results["failed"] += 1

    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"[PASSED]: {results['passed']}")
    print(f"[FAILED]: {results['failed']}")
    print(f"[SKIPPED]: {results['skipped']}")
    print(f"Total: {results['passed'] + results['failed'] + results['skipped']}")

    if results['failed'] == 0:
        print("\n*** ALL TESTS PASSED! ***")
        print("\nThe chunked cookie reassembly is working correctly.")
        print("Authentication is now fixed for all endpoints.")
    else:
        print("\n*** SOME TESTS FAILED ***")
        print("\nCheck the backend logs for detailed error messages.")
        print("Look for 'Reassembled cookie' messages in the logs.")

    print("="*60)

if __name__ == "__main__":
    main()
