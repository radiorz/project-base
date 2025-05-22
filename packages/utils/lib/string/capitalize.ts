/**
 * @function capitalize 大写首字母
 * @description 函数用于将字符串的首字母大写
 * @param
 * @returns
 * @example
 * capitalize("abc") // -> "Abc"
 */
export function capitalize(str: string = ''): string {
  if (typeof str !== 'string') throw new Error('str is not string');
  const [first, ...rest] = str;
  return !first ? '' : first.toUpperCase() + rest.join('');
}
