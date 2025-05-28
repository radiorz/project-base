/**
 * @function saveConfig
 * @description 函数用于
 * @param
 * @returns
 * @example
 * saveConfig() // ->
 */
import { createOverLoad } from '@tikkhun/overload';
import { getFileType } from './getFileType';
import { saveConfigToSheet, saveToEnv, saveToJsLike, saveToJson, saveToToml, saveToXml, saveToYaml } from './loaders';
import { FILE_TYPES } from './type';
export const saveConfig = createOverLoad({
  getType(arg: any, index: number) {
    if (index === 1) return getFileType(arg);
    return typeof arg; // 这里就简单搞成any了，目前第二参数，第三参数可以输入任意函数而不影响匹配
  },
});
saveConfig.addImpl('object', FILE_TYPES.json, saveToJson);
saveConfig.addImpl('object', FILE_TYPES.yaml, saveToYaml);
saveConfig.addImpl('object', FILE_TYPES.toml, saveToToml);
saveConfig.addImpl('object', FILE_TYPES.env, saveToEnv);
saveConfig.addImpl('object', FILE_TYPES.env, 'object', saveToEnv);
saveConfig.addImpl('object', FILE_TYPES.javascript, saveToJsLike);
saveConfig.addImpl('object', FILE_TYPES.typescript, saveToJsLike);
saveConfig.addImpl('object', FILE_TYPES.xml, saveToXml);
saveConfig.addImpl('object', FILE_TYPES.xml, 'object', saveToXml);
saveConfig.addImpl('object', FILE_TYPES.sheet, saveConfigToSheet);
