import { Cli, CommandTypes, echo } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { defaultMvOptions, mv } from '..';

export const optionTitles = {
  cwd: '根目录',
  includes: '包括的目录',
  exclude: '忽略的目录',
  // recursive: true,
  target: '目标目录',
};
export const optionTypes = {
  cwd: 'string',
  includes: 'array',
  exclude: 'array',
  // recursive: true,
  target: 'string',
};
export const cliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  types: [CommandTypes.info, CommandTypes.args, CommandTypes.prompts],
  defaultOptions: defaultMvOptions,
  optionTitles,
  optionTypes,
  action: async (options: any) => {
    mv(options);
  },
};
export const cli = new Cli(cliOptions);
