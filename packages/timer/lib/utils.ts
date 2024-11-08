let crypto: any;
if (typeof window !== 'undefined' && window.crypto) {
  crypto = window.crypto;
} else {
  crypto = require('node:crypto');
}
export function getRandom() {
  return crypto.randomUUID();
}

