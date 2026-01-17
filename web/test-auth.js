/**
 * Authentication Test Script
 *
 * This script tests the authentication system by:
 * 1. Checking database schema
 * 2. Verifying existing users
 * 3. Testing user creation
 * 4. Validating data integrity
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'auth.db');
const db = new Database(dbPath);

console.log('=== Authentication System Test ===\n');

// Test 1: Check database schema
console.log('Test 1: Database Schema');
console.log('------------------------');
try {
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='user'").get();
  console.log('✅ User table exists');
  console.log('Schema:', schema.sql);

  // Check if name column exists
  if (schema.sql.includes('name TEXT')) {
    console.log('✅ Name column exists in schema');
  } else {
    console.log('❌ Name column missing from schema');
  }
} catch (error) {
  console.log('❌ Error checking schema:', error.message);
}

console.log('\n');

// Test 2: List existing users
console.log('Test 2: Existing Users');
console.log('----------------------');
try {
  const users = db.prepare('SELECT id, email, name, emailVerified, createdAt FROM user').all();
  console.log(`Found ${users.length} user(s):`);
  users.forEach((user, index) => {
    console.log(`\nUser ${index + 1}:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name || '(null)'}`);
    console.log(`  Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
    console.log(`  Created: ${new Date(user.createdAt).toISOString()}`);

    // Check for issues
    if (!user.name) {
      console.log('  ⚠️  WARNING: Name is null');
    }
  });

  if (users.length === 0) {
    console.log('No users found in database');
  }
} catch (error) {
  console.log('❌ Error listing users:', error.message);
}

console.log('\n');

// Test 3: Check sessions
console.log('Test 3: Active Sessions');
console.log('-----------------------');
try {
  const sessions = db.prepare('SELECT userId, expiresAt FROM session').all();
  console.log(`Found ${sessions.length} active session(s)`);

  const now = new Date();
  sessions.forEach((session, index) => {
    const expiresAt = new Date(session.expiresAt);
    const isExpired = expiresAt < now;
    console.log(`\nSession ${index + 1}:`);
    console.log(`  User ID: ${session.userId}`);
    console.log(`  Expires: ${expiresAt.toISOString()}`);
    console.log(`  Status: ${isExpired ? '❌ Expired' : '✅ Active'}`);
  });
} catch (error) {
  console.log('❌ Error checking sessions:', error.message);
}

console.log('\n');

// Test 4: Validate data integrity
console.log('Test 4: Data Integrity');
console.log('----------------------');
try {
  // Check for users without names
  const usersWithoutNames = db.prepare("SELECT COUNT(*) as count FROM user WHERE name IS NULL OR name = ''").get();
  if (usersWithoutNames.count > 0) {
    console.log(`⚠️  WARNING: ${usersWithoutNames.count} user(s) without names`);
  } else {
    console.log('✅ All users have names');
  }

  // Check for duplicate emails
  const duplicateEmails = db.prepare('SELECT email, COUNT(*) as count FROM user GROUP BY email HAVING count > 1').all();
  if (duplicateEmails.length > 0) {
    console.log(`❌ ERROR: Found ${duplicateEmails.length} duplicate email(s)`);
    duplicateEmails.forEach(dup => {
      console.log(`  - ${dup.email}: ${dup.count} occurrences`);
    });
  } else {
    console.log('✅ No duplicate emails');
  }

  // Check for orphaned sessions
  const orphanedSessions = db.prepare(`
    SELECT s.userId
    FROM session s
    LEFT JOIN user u ON s.userId = u.id
    WHERE u.id IS NULL
  `).all();

  if (orphanedSessions.length > 0) {
    console.log(`⚠️  WARNING: ${orphanedSessions.length} orphaned session(s)`);
  } else {
    console.log('✅ No orphaned sessions');
  }
} catch (error) {
  console.log('❌ Error validating data:', error.message);
}

console.log('\n');

// Summary
console.log('=== Test Summary ===');
console.log('Database: ' + dbPath);
console.log('Status: Tests completed');
console.log('\nNext Steps:');
console.log('1. Start the dev server: npm run dev');
console.log('2. Navigate to the signup page');
console.log('3. Try creating a new user');
console.log('4. Check server logs for payload details');
console.log('5. Run this script again to verify user was created with name');

db.close();
