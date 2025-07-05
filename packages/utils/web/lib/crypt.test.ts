import { it, expect } from "vitest";
import { SimpleCrypto } from "./crypt";
import CryptoJS from "crypto-js";
it("simple crypto", () => {
  const crypto = new SimpleCrypto("tikkhbodyencryptdecryptpassword1");
  const original = "" + Math.random();
  const dtext = crypto.aesEncrypt(original);
  const text = crypto.aesDecrypt(dtext);
  expect(text).toBe(original);
});

it("crypto", () => {
  // Encrypt
  const original = "" + Math.random();
  const password = "" + Math.random();
  var ciphertext = CryptoJS.AES.encrypt(original, password).toString();

  // Decrypt
  var bytes = CryptoJS.AES.decrypt(ciphertext, password);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);

  expect(originalText).toBe(original);
});
