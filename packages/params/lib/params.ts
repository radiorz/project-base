/**
 * @function params
 * @description 函数用于
 * @param
 * @returns
 * @example
 * params() // ->
 */
export function params(message = '', variables: [], options: {}) {
  return message.replace(/\$\{(\w+)\}/g, (match, key) => {
    return variables[key] || '';
  });
}
