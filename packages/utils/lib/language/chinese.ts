// 判断字符串是否全是中文
export function isAllChinese(str: string) {
  return /^[\u4E00-\u9FA5]+$/.test(str);
}
// 判断字符串是否包含中文
export function hasChinese(str: string) {
  return /[\u4E00-\u9FA5]+/g.test(str);
}
