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
import { getFileType } from './getFileType';
export const loadConfig = createOverLoad({
  getType(arg: any, index: number) {
    if (index === 0) return getFileType(arg);
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
