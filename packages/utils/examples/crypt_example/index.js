const { SimpleCrypto } = require('@tikkhun/utils');
const password = 'meeyibodyencryptdecryptpassword1';

const theCrypto = new SimpleCrypto(password);
const encryptedText =
  '34ee5cfe8edcc1041a1d347fc2e10aa3c2d453b285f697811998f8d77a29e94f29414b1a0c828f6fe65ea02e725be81f';
const text = theCrypto.aesDecrypt(encryptedText);
console.log(`text`, text);
