#!/usr/bin/env python3
"""
Automated API Validation Script for Dynamic Profile Statistics Feature

This script performs automated validation tests for the user statistics API endpoint.
It tests authentication, data isolation, error handling, and performance.

Usage:
    python validate_api.py

Prerequisites:
    - Backend API running at http://localhost:8001
    - Two test user accounts with Better Auth session tokens
    - pip install requests
"""

import requests
import time
import json
from typing import Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
API_BASE_URL = "http://localhost:8001"
STATS_ENDPOINT = f"{API_BASE_URL}/api/v1/users/me/stats"

# Test results
test_results = []


def log_test(test_id: str, test_name: str, passed: bool, message: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    result = {
        "test_id": test_id,
        "test_name": test_name,
        "passed": passed,
        "message": message
    }
    test_results.append(result)
    print(f"{status} {test_id}: {test_name}")
    if message:
        print(f"   {message}")


def test_health_check():
    """Test that API is running"""
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        passed = response.status_code == 200
        log_test("T000", "API Health Check", passed,
                f"Status: {response.status_code}")
        return passed
    except Exception as e:
        log_test("T000", "API Health Check", False, f"Error: {str(e)}")
        return False


def test_unauthenticated_access():
    """T058: Test that unauthenticated requests return 401"""
    try:
        response = requests.get(STATS_ENDPOINT, timeout=5)
        passed = response.status_code == 401

        if passed:
            data = response.json()
            has_detail = "detail" in data
            passed = has_detail and data["detail"] == "Not authenticated"

        log_test("T058", "Unauthenticated Access Returns 401", passed,
                f"Status: {response.status_code}, Response: {response.text[:100]}")
        return passed
    except Exception as e:
        log_test("T058", "Unauthenticated Access Returns 401", False,
                f"Error: {str(e)}")
        return False


def test_authenticated_access(session_token: str):
    """T053: Test authenticated access via API"""
    try:
        cookies = {"better-auth.session_token": session_token}
        response = requests.get(STATS_ENDPOINT, cookies=cookies, timeout=5)

        passed = response.status_code == 200

        if passed:
            data = response.json()
            # Verify response schema
            required_fields = ["total_tasks", "completed_tasks", "completion_rate", "active_days"]
            has_all_fields = all(field in data for field in required_fields)

            # Verify data types and ranges
            valid_types = (
                isinstance(data["total_tasks"], int) and
                isinstance(data["completed_tasks"], int) and
                isinstance(data["completion_rate"], (int, float)) and
                isinstance(data["active_days"], int)
            )

            valid_ranges = (
                data["total_tasks"] >= 0 and
                data["completed_tasks"] >= 0 and
                0.0 <= data["completion_rate"] <= 100.0 and
                data["active_days"] >= 1
            )

            passed = has_all_fields and valid_types and valid_ranges

            log_test("T053", "Authenticated Access via API", passed,
                    f"Response: {json.dumps(data, indent=2)}")
        else:
            log_test("T053", "Authenticated Access via API", False,
                    f"Status: {response.status_code}, Response: {response.text[:100]}")

        return passed
    except Exception as e:
        log_test("T053", "Authenticated Access via API", False,
                f"Error: {str(e)}")
        return False


def test_data_isolation(session_token_a: str, session_token_b: str):
    """T057: Test that users see only their own statistics"""
    try:
        cookies_a = {"better-auth.session_token": session_token_a}
        cookies_b = {"better-auth.session_token": session_token_b}

        response_a = requests.get(STATS_ENDPOINT, cookies=cookies_a, timeout=5)
        response_b = requests.get(STATS_ENDPOINT, cookies=cookies_b, timeout=5)

        if response_a.status_code != 200 or response_b.status_code != 200:
            log_test("T057", "Data Isolation Between Users", False,
                    f"User A: {response_a.status_code}, User B: {response_b.status_code}")
            return False

        data_a = response_a.json()
        data_b = response_b.json()

        # Users should have different statistics (unless they happen to be identical)
        # At minimum, verify both requests succeed and return valid data
        passed = (
            data_a != data_b or  # Different stats (most likely)
            (data_a == data_b and data_a["total_tasks"] == 0)  # Both have zero todos
        )

        log_test("T057", "Data Isolation Between Users", passed,
                f"User A: {data_a}, User B: {data_b}")
        return passed
    except Exception as e:
        log_test("T057", "Data Isolation Between Users", False,
                f"Error: {str(e)}")
        return False


def test_performance(session_token: str, num_requests: int = 10):
    """T063: Test API response time"""
    try:
        cookies = {"better-auth.session_token": session_token}
        response_times = []

        for i in range(num_requests):
            start_time = time.time()
            response = requests.get(STATS_ENDPOINT, cookies=cookies, timeout=5)
            end_time = time.time()

            if response.status_code == 200:
                response_time_ms = (end_time - start_time) * 1000
                response_times.append(response_time_ms)

        if not response_times:
            log_test("T063", "API Response Time < 500ms", False,
                    "No successful requests")
            return False

        avg_time = sum(response_times) / len(response_times)
        max_time = max(response_times)
        min_time = min(response_times)

        passed = avg_time < 500 and max_time < 500

        log_test("T063", "API Response Time < 500ms", passed,
                f"Avg: {avg_time:.2f}ms, Min: {min_time:.2f}ms, Max: {max_time:.2f}ms")
        return passed
    except Exception as e:
        log_test("T063", "API Response Time < 500ms", False,
                f"Error: {str(e)}")
        return False


def test_concurrent_requests(session_token_a: str, session_token_b: str, num_requests: int = 50):
    """T064: Test no cross-user data leakage with concurrent requests"""
    try:
        cookies_a = {"better-auth.session_token": session_token_a}
        cookies_b = {"better-auth.session_token": session_token_b}

        # Get baseline statistics for each user
        baseline_a = requests.get(STATS_ENDPOINT, cookies=cookies_a, timeout=5).json()
        baseline_b = requests.get(STATS_ENDPOINT, cookies=cookies_b, timeout=5).json()

        def make_request(cookies, user_name):
            response = requests.get(STATS_ENDPOINT, cookies=cookies, timeout=5)
            if response.status_code == 200:
                return (user_name, response.json())
            return (user_name, None)

        # Make concurrent requests
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = []
            for i in range(num_requests):
                futures.append(executor.submit(make_request, cookies_a, "User A"))
                futures.append(executor.submit(make_request, cookies_b, "User B"))

            results = [future.result() for future in as_completed(futures)]

        # Verify all User A requests returned User A's data
        user_a_results = [r[1] for r in results if r[0] == "User A" and r[1] is not None]
        user_b_results = [r[1] for r in results if r[0] == "User B" and r[1] is not None]

        all_a_consistent = all(r == baseline_a for r in user_a_results)
        all_b_consistent = all(r == baseline_b for r in user_b_results)

        passed = all_a_consistent and all_b_consistent and len(user_a_results) > 0 and len(user_b_results) > 0

        log_test("T064", "No Cross-User Data Leakage (Concurrent)", passed,
                f"User A: {len(user_a_results)} consistent, User B: {len(user_b_results)} consistent")
        return passed
    except Exception as e:
        log_test("T064", "No Cross-User Data Leakage (Concurrent)", False,
                f"Error: {str(e)}")
        return False


def test_zero_division_handling(session_token: str):
    """T054: Test that zero todos doesn't cause division by zero"""
    try:
        cookies = {"better-auth.session_token": session_token}
        response = requests.get(STATS_ENDPOINT, cookies=cookies, timeout=5)

        if response.status_code != 200:
            log_test("T054", "Zero Todos Handling", False,
                    f"Status: {response.status_code}")
            return False

        data = response.json()

        # If user has zero todos, completion_rate should be 0.0, not NaN or error
        if data["total_tasks"] == 0:
            passed = data["completion_rate"] == 0.0
            log_test("T054", "Zero Todos Handling", passed,
                    f"Completion rate with 0 todos: {data['completion_rate']}")
            return passed
        else:
            log_test("T054", "Zero Todos Handling", True,
                    f"User has {data['total_tasks']} todos (test requires 0 todos)")
            return True
    except Exception as e:
        log_test("T054", "Zero Todos Handling", False,
                f"Error: {str(e)}")
        return False


def print_summary():
    """Print test summary"""
    print("\n" + "="*60)
    print("VALIDATION SUMMARY")
    print("="*60)

    total_tests = len(test_results)
    passed_tests = sum(1 for r in test_results if r["passed"])
    failed_tests = total_tests - passed_tests

    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests} ✅")
    print(f"Failed: {failed_tests} ❌")
    print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")

    if failed_tests > 0:
        print("\nFailed Tests:")
        for result in test_results:
            if not result["passed"]:
                print(f"  - {result['test_id']}: {result['test_name']}")
                if result["message"]:
                    print(f"    {result['message']}")

    print("="*60)


def main():
    """Main validation function"""
    print("="*60)
    print("Dynamic Profile Statistics - API Validation")
    print("="*60)
    print()

    # Check if API is running
    if not test_health_check():
        print("\n❌ API is not running. Please start the backend server:")
        print("   cd api && uvicorn src.main:app --reload --port 8001")
        return

    print("\n📝 Note: Some tests require Better Auth session tokens.")
    print("   To get session tokens:")
    print("   1. Log in to the web app")
    print("   2. Open browser DevTools → Application → Cookies")
    print("   3. Copy the 'better-auth.session_token' value")
    print()

    # Get session tokens from user
    print("Enter session tokens for testing (or press Enter to skip authenticated tests):")
    session_token_a = input("User A session token: ").strip()
    session_token_b = input("User B session token (for isolation test): ").strip()

    print("\n" + "="*60)
    print("Running Tests...")
    print("="*60 + "\n")

    # Run tests
    test_unauthenticated_access()

    if session_token_a:
        test_authenticated_access(session_token_a)
        test_zero_division_handling(session_token_a)
        test_performance(session_token_a)

        if session_token_b:
            test_data_isolation(session_token_a, session_token_b)
            test_concurrent_requests(session_token_a, session_token_b)
        else:
            print("\n⚠️  Skipping multi-user tests (User B token not provided)")
    else:
        print("\n⚠️  Skipping authenticated tests (no session tokens provided)")

    # Print summary
    print_summary()

    # Save results to file
    with open("validation_results.json", "w") as f:
        json.dump(test_results, f, indent=2)
    print(f"\n📄 Results saved to: validation_results.json")


if __name__ == "__main__":
    main()
