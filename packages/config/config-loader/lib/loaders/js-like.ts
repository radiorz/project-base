import { pathToFileURL } from 'node:url';

export async function importModuleDefault(filePath: string) {
  const module = await import(pathToFileURL(filePath).href);
  const result = module.default;
  // 如果是ESM模块，并且有default导出，返回default导出，否则返回整个模块对象
  if (hasOnlyDefaultKey(result)) return result.default;
  return result;
}
export function hasOnlyDefaultKey(obj: object): boolean {
  const keys = Object.keys(obj);
  return keys.length === 1 && keys[0] === 'default';
}
