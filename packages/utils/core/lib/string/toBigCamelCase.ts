/**
 * @function toBigCamelCase 字符串转大驼峰
 * @description 函数用于字符串的形式转大驼峰
 * @param
 * @returns
 * @example
 * console.log(toBigCamelCase("kebab-case")); // 输出 "KebabCase"
 * console.log(toBigCamelCase("snake_case")); // 输出 "SnakeCase"
 * console.log(toBigCamelCase("small-camel-case")); // 输出 "SmallCamelCase"
 */
export function toBigCamelCase(str: string) {
  str = str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()); // 将连字符和下划线后的字符转换为大写
  return str.replace(/^\w/, (c) => c.toUpperCase()); // 将首字母转换为大写
}
