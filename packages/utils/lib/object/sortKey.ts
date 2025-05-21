/**
 * 调整key顺序
 * @param obj
 * @returns
 */
export function sortKey(obj: Record<string, any>) {
  const sortedObj = Object.keys(obj)
    .sort()
    .reduce((sorted: any, key) => {
      sorted[key] = obj[key];
      return sorted;
    }, {});

  return sortedObj;
}
