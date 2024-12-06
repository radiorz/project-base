
import { Cli, CommandTypes } from '@tikkhun/cli-core';
import { omit } from 'lodash';
import { Creator } from '..';
import packageJson from '../../package.json';
import { creatorCliOptions } from './creator-cli';

export const creatorManagerCliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  types: [CommandTypes.args, CommandTypes.prompts],
  description: packageJson.description,
  excludeOptions: [...creatorCliOptions.excludeOptions],
  defaultOptions: {
    ...omit(Creator.DEFAULT_OPTIONS, 'template'),
    templatesDir: 'templates',
  },
  optionTitles: {
    ...omit(creatorCliOptions.optionTitles, 'template'),
    templatesDir: '模板存放路径',
  },
  optionTypes: {
    ...omit(creatorCliOptions.optionTypes, 'template'),
    templatesDir: 'string',
  },
};
// console.log(`creatorManagerCliOptions`, creatorManagerCliOptions);
export const creatorManagerCli = new Cli(creatorManagerCliOptions);

