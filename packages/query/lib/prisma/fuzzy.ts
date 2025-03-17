export function fuzzy(value: string): any {
  if (typeof value === 'string') {
    return {
      contains: value,
    };
  }
  return value;
}
export function fuzzyMany(query: Record<string, any>, keys: string[] = []) {
  if (!query) return query;
  keys.forEach((key) => {
    if (query[key] === undefined || query[key] === null) {
      return;
    }
    query[key] = fuzzy(query[key]);
  });
}
