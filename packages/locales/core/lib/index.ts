/**
 * @function createResourceBaseLocale
 * @description 函数用于
 * @param
 * @returns
 * @example
 * createResourceBaseLocale() // ->
 */
export function createResourceBaseLocale(name: string, locale: string, common: Record<string, any>) {
  return {
    name: {
      name: locale,
      create: `${common.create}${name}`,
      update: `${common.update}${name}`,
      delete: `${common.delete}${name}`,
      query: `${common.query}${name}`,
    },
  };
}
