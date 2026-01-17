const Database = require('better-sqlite3');
const db = new Database('auth.db');

console.log('=== RECENT USERS IN DATABASE ===\n');

const users = db.prepare(`
  SELECT u.email, u.name, u.createdAt, a.password, a.providerId, LENGTH(a.password) as pwd_len
  FROM user u
  LEFT JOIN account a ON u.id = a.userId
  ORDER BY u.createdAt DESC
  LIMIT 10
`).all();

users.forEach((user, index) => {
  console.log(`${index + 1}. Email: ${user.email}`);
  console.log(`   Name: ${user.name}`);
  console.log(`   Provider: ${user.providerId || 'N/A'}`);
  console.log(`   Created: ${new Date(user.createdAt).toISOString()}`);
  console.log(`   Password exists: ${!!user.password}`);
  console.log(`   Password length: ${user.pwd_len || 0}`);

  if (user.password) {
    const parts = user.password.split(':');
    if (parts.length === 2) {
      console.log(`   Password format: ✅ salt:hash (CORRECT)`);
      console.log(`   Salt length: ${parts[0].length}`);
      console.log(`   Hash length: ${parts[1].length}`);
    } else {
      console.log(`   Password format: ❌ INVALID`);
    }
  } else {
    console.log(`   ⚠️  WARNING: No password stored!`);
  }

  console.log('');
});

db.close();

console.log('='.repeat(80));
console.log('INSTRUCTIONS:');
console.log('1. Find YOUR email in the list above');
console.log('2. Check if password exists and format is correct');
console.log('3. Try signing in with that EXACT email (copy-paste it)');
console.log('='.repeat(80));
