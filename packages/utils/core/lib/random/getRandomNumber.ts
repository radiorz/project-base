// 获取随机数
export function getRandomNumber(min: number, range: number) {
  return Math.round(Math.random() * range + min);
}
