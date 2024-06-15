const { SimpleCrypto } =require('@tikkhun/utils');
const crypto = new SimpleCrypto('tikkhbodyencryptdecryptpassword1');
const original = 'aaa';
const dtext = crypto.aesEncrypt(original);

const text = crypto.aesDecrypt(dtext);
console.log(`dtext`, dtext);
console.log(`text`, text);
console.log(`text === original`, text === original);
