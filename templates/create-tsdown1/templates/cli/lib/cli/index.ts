import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { hello } from '..';
export const defaultOptions = {
  value: 'world',
};
export const optionTitles = {
  value: '对象',
};
export const optionTypes = {
  value: 'string',
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
    hello(options?.value);
  },
};
export const cli = new Cli(cliOptions);
