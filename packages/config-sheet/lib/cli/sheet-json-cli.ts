import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { sheet2json } from '../sheet-json';
export const sheet2JsonOptionDefaults = {
  input: 'package.xlsx',
  output: 'package_tran.json',
  keyHeader: 'key',
  valueHeader: 'value',
};
export const sheet2JsonOptionTitles = {
  input: '输入文件',
  output: '输出文件',
  keyHeader: '键表头',
  valueHeader: '值表头',
};
export const sheet2JsonOptionTypes = {
  input: 'string',
  output: 'string',
  keyHeader: 'string',
  valueHeader: 'string',
};
export const sheet2JsonCliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  types: [CommandTypes.args, CommandTypes.prompts],
  defaultOptions: sheet2JsonOptionDefaults,
  optionTitles: sheet2JsonOptionTitles,
  optionTypes: sheet2JsonOptionTypes,
  action: async (options: any) => {
    await sheet2json(options);
  },
};
export const sheet2JsonCli = new Cli(sheet2JsonCliOptions);
