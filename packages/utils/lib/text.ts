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

/**
 * 说明: 函数用于大写首字母
 * @param
 * @returns
 * @example
 * capitalize("abc") // -> "Abc"
 */
export function capitalize([first, ...rest]: string): string {
  return !first ? "" : first.toUpperCase() + rest.join("");
}
