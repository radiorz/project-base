import CryptoJS from "crypto-js";
/** 加解密body */

const NULL_IV = CryptoJS.enc.Hex.parse(""); // new Buffer([]);

const cryptoOptions = {
  // 加密模式
  mode: CryptoJS.mode.ECB,
  // 填充模式
  padding: CryptoJS.pad.Pkcs7,
  // 初始向量 在 ECB中没用
  iv: NULL_IV,
  // 密钥大小 表示加密算法使用的密钥的位数
  keySize: 256,
};
export class SimpleCrypto {
  cryptKey: CryptoJS.lib.WordArray;
  constructor(private password = "") {
    this.cryptKey = CryptoJS.enc.Utf8.parse(this.password);
  }
  /**
   * 加密文本
   * @param {*} string
   * @returns {string}
   */
  aesEncrypt(str = "") {
    const cipherParams = CryptoJS.AES.encrypt(
      str,
      this.cryptKey,
      cryptoOptions
    );
    return cipherParams.ciphertext.toString();
  }

  /**
   * 解密文本
   * @param {*} string
   * @returns {string}
   */
  aesDecrypt(str = "") {
    const words = CryptoJS.enc.Hex.parse(str);
    const bytes = CryptoJS.AES.decrypt(
      { ciphertext: words } as CryptoJS.lib.CipherParams,
      CryptoJS.enc.Utf8.parse(this.password),
      cryptoOptions
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
