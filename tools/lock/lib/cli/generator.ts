import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { generateKey } from '..';
export const defaultOptions = {
  password: '123456',
};
export const optionTitles = {
  password: '密码',
};
export const optionTypes = {
  password: 'string',
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
    const result = await generateKey(options?.password);
    console.log(result);
  },
};
export const cli = new Cli(cliOptions);
