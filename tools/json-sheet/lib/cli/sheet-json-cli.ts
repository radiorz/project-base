import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
export const Sheet2JsonOptionDefaults = {
  input: 'package.xlsx',
  output: 'package.json',
  keyHeader: 'key',
  valueHeader: 'value',
}
export const Sheet2JsonOptionTitles = {
  input: '输入文件',
  output: '输出文件',
  keyHeader: '键表头',
  valueHeader: '值表头',
};
export const Sheet2JsonOptionTypes = {
  input: 'string',
  output: 'string',
  keyHeader: 'string',
  valueHeader: 'string',
};
export const Sheet2JsonCliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  types: [CommandTypes.args, CommandTypes.prompts],
  defaultOptions: Sheet2JsonOptionDefaults,
  optionTitles: Sheet2JsonOptionTitles,
  optionTypes: Sheet2JsonOptionTypes,
};
export const Sheet2JsonCli = new Cli(Sheet2JsonCliOptions);
