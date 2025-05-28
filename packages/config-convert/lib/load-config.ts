/**
 * @function loadConfig
 * @description 函数用于
 * @param
 * @returns
 * @example
 * loadConfig() // ->
 */
import { readFileSync } from 'fs';
import path from 'path';
import JSON5 from 'json5';
import toml from 'toml';
import yaml from 'js-yaml';
import { createOverLoad } from '@tikkhun/overload';
import { pathToFileURL } from 'node:url';
import { listToNestedObject, ListToNestedObjectOptions, toCamelCase } from '@tikkhun/utils-core';
import { loadXml } from './xml';

export enum FILE_TYPES {
  javascript = 'javascript',
  json = 'json',
  json5 = 'json5',
  yaml = 'yaml',
  typescript = 'typescript',
  env = 'env',
  toml = 'toml',
  xml = 'xml',
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
    case '.xml':
      return FILE_TYPES.xml;
    default:
      console.error(`不支持的文件格式: ${ext}`);
      return null;
  }
}
export const loadConfig = createOverLoad({
  getType(arg: any, index: number) {
    if (index === 0) return getFilePathType(arg);
    return typeof arg; // 这里就简单搞成any了，目前第二参数，第三参数可以输入任意函数而不影响匹配
  },
});

export const loadJSON = async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
};
export const loadJSON5 = async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return JSON5.parse(fileContent);
};
export const loadYaml = async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return yaml.load(fileContent);
};
export const loadToml = async (filePath: string) => {
  const fileContent = readFileSync(filePath, 'utf8');
  return toml.parse(fileContent);
};
export const loadEnvConfig = (filePath: string, options?: Partial<ListToNestedObjectOptions>) => {
  const fileContent = readFileSync(filePath, 'utf8');
  const envList = [] as { key: string; value: string }[];
  fileContent.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      envList.push({ key, value });
    }
  });
  // TODO 这里好像没有对value进行转换？ nested args 可以上场
  const env = listToNestedObject({
    delimiter: '__',
    list: envList,
    keyItemTransformer: function (v: string): string {
      return toCamelCase(v);
    },
    ...options,
  });
  return env;
};
loadConfig.addImpl(FILE_TYPES.json, loadJSON);
loadConfig.addImpl(FILE_TYPES.json5, loadJSON5);
loadConfig.addImpl(FILE_TYPES.yaml, loadYaml);
loadConfig.addImpl(FILE_TYPES.toml, loadToml);
// 有参数和无参数的情况对于overload通常是分开两种，所以只能分开写了
loadConfig.addImpl(FILE_TYPES.env, loadEnvConfig);
loadConfig.addImpl(FILE_TYPES.env, 'object', loadEnvConfig);
loadConfig.addImpl(FILE_TYPES.javascript, importModuleDefault);
loadConfig.addImpl(FILE_TYPES.typescript, importModuleDefault);
loadConfig.addImpl(FILE_TYPES.xml, loadXml);
loadConfig.addImpl(FILE_TYPES.xml, 'object', loadXml);

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
