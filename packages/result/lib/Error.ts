/**
 * @function createError
 * @description 函数用于
 * @param
 * @returns
 * @example
 * createError() // ->
 */
export function createError(token: string) {
  const result = findResult(token);
  const error = new Error(result.message);
}
