import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { json2Sheet } from '../json-sheet';
export const Json2SheetOptionDefaults = {
  input: 'package.json',
  output: 'package.xlsx',
  keyHeader: 'key',
  valueHeader: 'value',
};
export const Json2SheetOptionTitles = {
  input: '输入文件',
  output: '输出文件',
  keyHeader: '键表头',
  valueHeader: '值表头',
};
export const Json2SheetOptionTypes = {
  input: 'string',
  output: 'string',
  keyHeader: 'string',
  valueHeader: 'string',
};
export const json2SheetCliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  types: [CommandTypes.args, CommandTypes.prompts],
  defaultOptions: Json2SheetOptionDefaults,
  excludeOptions: ['projectDirOptions.build'],
  optionTitles: Json2SheetOptionTitles,
  optionTypes: Json2SheetOptionTypes,
  action: async (options: any) => {
    await json2Sheet(options);
  },
};
export const json2SheetCli = new Cli(json2SheetCliOptions);
