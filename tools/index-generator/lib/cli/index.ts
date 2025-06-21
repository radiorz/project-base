import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { DefaultGenerateIndexOptions, generateIndex } from '..';
export const defaultOptions = {
  ...DefaultGenerateIndexOptions,
  child: false
};
export const optionTitles = {
  cwd: '路径',
  indexName: '文件名',
  include: '包含',
  exclude: '排除',
  clean: '清除旧的',
  child: '子目录'
};
export const optionTypes = {
  cwd: 'string',
  indexName: 'string',
  include: 'array',
  exclude: 'array',
  clean: 'boolean',
  child: 'boolean'
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
    generateIndex(options);
  },
};
export const cli = new Cli(cliOptions);
