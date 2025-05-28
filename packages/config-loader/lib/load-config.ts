/**
 * @function loadConfig
 * @description 函数用于
 * @param
 * @returns
 * @example
 * loadConfig() // ->
 */
import { createOverLoad } from '@tikkhun/overload';
import { basename, extname } from 'node:path';
import { loadConfigFromSheet, loadEnvConfig, loadFromXml, loadJSON, loadJSON5, loadToml, loadYaml } from './loaders';
import { importModuleDefault } from './loaders';
import { FILE_TYPES } from './type';

export function getFilePathType(arg: any) {
  const filePath = arg;
  const fileBaseName = basename(filePath);
  // 根据前缀判断
  if (fileBaseName.startsWith('.env')) return FILE_TYPES.env;
  // 根据文件扩展名判断文件类型
  const ext = extname(fileBaseName);
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
    case '.xlsx':
      return FILE_TYPES.sheet;
    default:
      console.error(`文件的格式不受支持: ${filePath}`);
      return null;
  }
}
export const loadConfig = createOverLoad({
  getType(arg: any, index: number) {
    if (index === 0) return getFilePathType(arg);
    return typeof arg; // 这里就简单搞成any了，目前第二参数，第三参数可以输入任意函数而不影响匹配
  },
});
loadConfig.addImpl(FILE_TYPES.json, loadJSON);
loadConfig.addImpl(FILE_TYPES.json5, loadJSON5);
loadConfig.addImpl(FILE_TYPES.yaml, loadYaml);
loadConfig.addImpl(FILE_TYPES.toml, loadToml);
// 有参数和无参数的情况对于overload通常是分开两种，所以只能分开写了
loadConfig.addImpl(FILE_TYPES.env, loadEnvConfig);
loadConfig.addImpl(FILE_TYPES.env, 'object', loadEnvConfig);
loadConfig.addImpl(FILE_TYPES.javascript, importModuleDefault);
loadConfig.addImpl(FILE_TYPES.typescript, importModuleDefault);
loadConfig.addImpl(FILE_TYPES.xml, loadFromXml);
loadConfig.addImpl(FILE_TYPES.xml, 'object', loadFromXml);
loadConfig.addImpl(FILE_TYPES.sheet, loadConfigFromSheet);
