import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { readConfig } from '..';
export const defaultOptions = {
  path: 'package.json',
};
export const optionTitles = {
  path: '路径',
};
export const optionTypes = {
  path: 'string',
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
    const config = await readConfig(options?.value);
    console.log(config);
  },
};
export const cli = new Cli(cliOptions);
