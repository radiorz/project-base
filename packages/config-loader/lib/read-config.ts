/**
 * @function readConfig
 * @description 函数用于
 * @param
 * @returns
 * @example
 * readConfig() // ->
 */
import { readFileSync } from 'fs';
import path from 'path';
import JSON5 from 'json5';
import toml from 'toml';
import yaml from 'js-yaml';
import { createOverLoad } from '@tikkhun/overload';
import { pathToFileURL } from 'node:url';

export enum FILE_TYPES {
  javascript = 'javascript',
  json = 'json',
  json5 = 'json5',
  yaml = 'yaml',
  typescript = 'typescript',
  env = 'env',
  toml = 'toml',
}
function getFilePathType(arg: any) {
  const filePath = arg;
  // 根据前缀判断
  if (filePath.startsWith('.env')) return FILE_TYPES.env;
  // 根据文件扩展名判断文件类型
  const ext = path.extname(filePath);
  switch (ext) {
    case '.toml':
      return FILE_TYPES.toml;
    case '.mjs':
    case '.js':
    case '.cjs':
      // 动态加载 JS 文件
      return FILE_TYPES.javascript;
    case '.json':
      return FILE_TYPES.json;
    case '.json5':
      return FILE_TYPES.json5;
    case '.yaml':
    case '.yml':
      return FILE_TYPES.yaml;
    case '.ts':
    case '.mts':
    case '.cts':
      return FILE_TYPES.typescript;
    default:
      console.error(`不支持的文件格式: ${ext}`);
      return null;
  }
}
export const readConfig = createOverLoad({
  getType(arg: any, index: number) {
    if (index === 0) return getFilePathType(arg);
    return typeof arg;
  },
});
readConfig.addImpl(FILE_TYPES.json, async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
});
readConfig.addImpl(FILE_TYPES.json5, async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return JSON5.parse(fileContent);
});
readConfig.addImpl(FILE_TYPES.yaml, async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return yaml.load(fileContent);
});
readConfig.addImpl(FILE_TYPES.toml, async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return toml.parse(fileContent);
});
readConfig.addImpl(FILE_TYPES.env, (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  const env = {} as Record<string, string>;
  fileContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key] = value;
    }
  });
  return env;
});
function hasOnlyDefaultKey(obj: object): boolean {
  const keys = Object.keys(obj);
  return keys.length === 1 && keys[0] === 'default';
}

async function importModuleDefault(filePath: string) {
  const module = await import(pathToFileURL(filePath).href);
  const result = module.default;
  // 如果是ESM模块，并且有default导出，返回default导出，否则返回整个模块对象
  if (hasOnlyDefaultKey(result)) return result.default;
  return result;
}
readConfig.addImpl(FILE_TYPES.javascript, importModuleDefault);
readConfig.addImpl(FILE_TYPES.typescript, importModuleDefault);
