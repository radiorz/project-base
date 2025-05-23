import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { generateIndex } from '..';
import { workspace } from '../../../version/lib/utils';
export const defaultOptions = {
  workspace: '.',
};
export const optionTitles = {
  workspace: '路径',
};
export const optionTypes = {
  workspace: 'string',
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
    generateIndex(options?.workspace);
  },
};
export const cli = new Cli(cliOptions);
