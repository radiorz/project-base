/**
 * @function getUnScopedName
 * @description 函数用于
 * @param
 * @returns
 * @example
 * getUnScopedName() // ->
 */
export function getUnScopedName(str: string): string {
  // 如果字符串以 @ 开头，表示是一个作用域包
  if (str.startsWith('@')) {
    // 找到第一个斜杠的位置
    const firstSlashIndex = str.indexOf('/');
    // 返回斜杠后面的部分，即未作用域的包名
    return str.slice(firstSlashIndex + 1);
  }
  // 如果不是作用域包，直接返回原字符串
  return str;
}
