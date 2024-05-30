export function isStringInEnum<T extends string>(
  value: string,
  enumObject: Record<string, T>,
): value is T {
  return Object.values(enumObject).includes(value as T);
}
