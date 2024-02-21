declare class SimpleCrypto {
    private password;
    constructor(password?: string);
    /**
     * 加密文本
     * @param {*} string
     * @returns {string}
     */
    aesEncrypt(string?: string): string;
    /**
     * 解密文本
     * @param {*} string
     * @returns {string}
     */
    aesDecrypt(string?: string): string;
}
export { SimpleCrypto };
//# sourceMappingURL=crypt.d.ts.map