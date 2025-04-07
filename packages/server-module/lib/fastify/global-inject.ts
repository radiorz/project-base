/**
 * @function injectDb
 * @description 函数用于
 * @param
 * @returns
 * @example
 * injectDb() // ->
 */
export function injectDb(db: any, app: any) {
  app.$db = db;
}
