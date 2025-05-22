/**
 * @function toConstCase 转成大写形式
 * @description 函数用于转大写形式
 * @param
 * @returns
 * @example
 * > toConstCase('bigCase') // -> "BIG_CASE"
 * > toConstCase('big_case') // -> "BIG_CASE"
 * > toConstCase('big case') // -> "BIG_CASE"
 */
export function toConstCase(camelString: string = '') {
  return camelString
    .replace(/[-\s]/g, '_') // 将连字符和空格替换为下划线
    .replace(/[A-Z]/g, (match) => `_${match}`) /* 将大写字符改成_大写字符 */
    .toUpperCase() /* 将所有小写字符转大写字符 */;
}
