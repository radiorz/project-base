// 生成随机 16进制颜色
export function color16() {
  return ((Math.random() * 0x1000000) << 0).toString(16);
}
// 获取随机数
export function getRandomNumber(min: number, range: number) {
  return Math.round(Math.random() * range + min);
}
