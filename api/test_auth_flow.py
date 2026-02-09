#!/usr/bin/env python3
"""
Test the authentication flow end-to-end with detailed logging.
"""
import requests
import json

# Test with the full token from the database
FULL_TOKEN = "xSufCMuRzGB1zeEgzQqJnwg0JLLMmILD"
API_URL = "http://localhost:8000/api/v1/users/me/stats"

print("Testing authentication flow...")
print(f"Token: {FULL_TOKEN}")
print(f"Token length: {len(FULL_TOKEN)}")
print()

# Test 1: Direct request with cookie
print("Test 1: Direct request with full token in cookie")
response = requests.get(
    API_URL,
    cookies={"better-auth.session_token": FULL_TOKEN}
)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
print()

# Test 2: Check what cookies are being sent
print("Test 2: Verify cookie is sent correctly")
session = requests.Session()
session.cookies.set("better-auth.session_token", FULL_TOKEN)
print(f"Cookies in session: {dict(session.cookies)}")
print(f"Cookie value length: {len(session.cookies.get('better-auth.session_token', ''))}")
print()

# Test 3: Make request and check response
print("Test 3: Make request with session")
response = session.get(API_URL)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
print()

# Test 4: Check if it's a CORS issue
print("Test 4: Request with origin header")
response = requests.get(
    API_URL,
    cookies={"better-auth.session_token": FULL_TOKEN},
    headers={"Origin": "http://localhost:3000"}
)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
print(f"CORS headers: {response.headers.get('access-control-allow-credentials')}")
