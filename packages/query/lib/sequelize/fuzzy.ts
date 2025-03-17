import { Op } from 'sequelize';

export function fuzzy(value: string): any {
  if (typeof value === 'string') {
    return {
      [Op.like]: `%${value}%`,
    };
  }
  return value;
}
export function fuzzyMany(query: Record<string, any>, keys: string[] = []) {
  if (!query) return query;
  keys.forEach((key) => {
    query[key] = fuzzy(query[key]);
  });
}
