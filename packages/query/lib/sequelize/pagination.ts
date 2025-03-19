// 定义一个函数，将十进制数字转换为26进制字符串
function toBase26(num: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let n = num;

  while (n > 0) {
    let remainder = (n - 1) % 26; // 26进制的余数
    result = alphabet[remainder] + result; // 将对应的字母加到结果前面
    n = Math.floor((n - 1) / 26); // 更新n
  }

  return result || 'A'; // 如果结果为空，返回'A'（对应0）
}

// 定义一个函数，将二进制字符串转换为26进制字符串
function binaryToBase26(binary: string): string {
  const decimal = parseInt(binary, 2); // 将二进制字符串转换为十进制数字
  return toBase26(decimal); // 调用toBase26函数进行转换
}

// 定义一个函数，将十进制数字转换为26进制字符串
function decimalToBase26(decimal: number): string {
  return toBase26(decimal); // 直接调用toBase26函数进行转换
}

// 测试函数
console.log(binaryToBase26('1010')); // 输出：A
console.log(decimalToBase26(10)); // 输出：A
console.log(decimalToBase26(26)); // 输出：Z
console.log(decimalToBase26(27)); // 输出：AA
