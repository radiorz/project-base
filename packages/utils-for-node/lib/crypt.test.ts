import { it, expect } from 'vitest';
import { SimpleCrypto } from './crypt';

it('crypto', () => {
  const crypto = new SimpleCrypto('tikkhbodyencryptdecryptpassword1');
  const original = '' + Math.random();
  const dtext = crypto.aesEncrypt(original);

  const text = crypto.aesDecrypt(dtext);
  console.log(`text`, dtext);
  expect(text).toBe(original);
});
