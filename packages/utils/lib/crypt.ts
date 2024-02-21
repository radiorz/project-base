import crypto from "node:crypto";
/** 加解密body */

const NULL_IV = Buffer.from([]); // new Buffer([]);
const algorithm = "aes-256-ecb";

class SimpleCrypto {
  constructor(private password = "") {}
  /**
   * 加密文本
   * @param {*} string
   * @returns {string}
   */
  aesEncrypt(string = "") {
    const cipher = crypto.createCipheriv(algorithm, this.password, NULL_IV);
    let encrypted = Buffer.concat([
      cipher.update(Buffer.from(string, "utf8")),
      cipher.final(),
    ]);
    return encrypted.toString("hex");
  }

  /**
   * 解密文本
   * @param {*} string
   * @returns {string}
   */
  aesDecrypt(string = "") {
    const decipher = crypto.createDecipheriv(algorithm, this.password, NULL_IV);
    let decrypted = Buffer.concat([
      decipher.update(Buffer.from(string, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
export { SimpleCrypto };
