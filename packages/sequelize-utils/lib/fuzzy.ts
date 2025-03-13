import { Op } from 'sequelize';

export function fuzzyString(value: string) {
  if (typeof value === 'string') {
    return {
      [Op.like]: `%${value}%`,
    };
  }
  return value;
}
export function fuzzyManyString(query: Record<string, any>, keys: string[] = []) {
  if (!query) return query;
  keys.forEach((key) => {
    query[key] = fuzzyString(query[key]);
  });
}
