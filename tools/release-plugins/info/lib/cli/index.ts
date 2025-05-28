import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { getInfo } from '..';
export const defaultOptions = {
  options: [],
};
export const optionTitles = {
  options: '选项',
};
export const optionTypes = {
  options: 'objectArray',
};
export const cliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  types: [CommandTypes.args, CommandTypes.prompts],
  defaultOptions,
  optionTitles,
  optionTypes,
  action: async (options: any) => {
    getInfo(options?.value);
  },
};
export const cli = new Cli(cliOptions);
