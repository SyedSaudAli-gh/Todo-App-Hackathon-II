const crypto = require('crypto');

// Generate RSA-2048 key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Convert to single-line format with \n escape sequences
function toSingleLine(pemKey) {
  return pemKey.replace(/\n/g, '\\n');
}

const privateKeySingleLine = toSingleLine(privateKey);
const publicKeySingleLine = toSingleLine(publicKey);

// Output as JSON for programmatic use
console.log(JSON.stringify({
  privateKey: privateKeySingleLine,
  publicKey: publicKeySingleLine
}));
