/**
 * @function toCamelCase 转小驼峰
 * @description 函数用于字符串的形式转大驼峰
 * @param
 * @returns
 * @example
 * console.log(toCamelCase("kebab-case")); // 输出 "kebabCase"
 * console.log(toCamelCase("snake_case")); // 输出 "snakeCase"
 * console.log(toCamelCase("big-camel-case")); // 输出 "bigCamelCase"
 */
export function toCamelCase(str: string) {
  str = str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()); // 将连字符和下划线后的字符转换为大写
  return str.charAt(0).toLowerCase() + str.slice(1); // 将首字母转换为小写
}
