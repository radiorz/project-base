// 生成随机 16进制颜色
export function getRandomRGBColor() {
  return ((Math.random() * 0x1000000) << 0).toString(16);
}
