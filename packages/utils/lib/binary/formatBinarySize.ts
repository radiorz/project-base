export const binaryUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
/**
 * 二进制大小转换，将字节数转换为合适的二进制单位（B, KB, MB, GB, TB, PB）
 * @param size - 待转换的字节数
 * @returns 格式化后的字符串，包含数值和对应的二进制单位
 */
export const formatBinarySize = (size: number) => {
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};
