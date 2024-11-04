/**
 * @author
 * @file text.ts
 * @fileBase text
 * @path packages\utils\lib\text.ts
 * @from
 * @desc 跟文本字符串有关
 * @todo
 *
 *
 * @done
 * @example
 */

import { isNil } from './is';

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
/**
 * 替代params
 * @param {String} pattern
 * @param {Object} variables 
 * @param {Object} options
 * @returns
 * @example
 * replaceParams("{app}",{app: "hahah"}) => "hahah"
 */
export function replaceParams(pattern: string, variables: Record<string, any>, options = { keepMatch: false }): string {
  return pattern.replace(/\{([^}]+)\}/g, (match, key) => {
    return variables.hasOwnProperty(key) && !isNil(variables[key]) ? variables[key] : options.keepMatch ? match : '';
  });
}
