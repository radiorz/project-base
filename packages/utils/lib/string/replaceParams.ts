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

import { isNil } from '../is/isNil';
import { mergeOptions } from '../object';

/**
 * 替代params
 * @param {String} pattern 模板 比如 “aaa”
 * @param {Object} variables 用于替代的变量
 * @param {Object} options
 * @param {Boolean} options.keepMatch 是否保留用于匹配的字符串 比如 {xxx}
 * @returns
 * @example
 * replaceParams("{app}",{app: "hahah"}) => "hahah"
 */
export function replaceParams(
  pattern: string,
  variables: Record<string, any> = {},
  options = { keepMatch: false, stringify: true },
): string {
  const { keepMatch, stringify } = mergeOptions({ keepMatch: false, stringify: true }, options);
  return pattern.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = variables[key];
    return variables.hasOwnProperty(key) && !isNil(value)
      ? stringify && typeof value === 'object'
        ? JSON.stringify(value)
        : value
      : keepMatch
        ? match
        : '';
  });
}
