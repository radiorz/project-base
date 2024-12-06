import { Cli, CommandTypes } from '@tikkhun/cli-core';
import _ from 'lodash';
const { omit } = _;
import { Creator } from '../Creator';
import { TemplateChooser } from '../TemplateChooser';
import packageJson from '../../package.json';
import { creatorCli, creatorCliOptions } from './creator-cli';
import { templatesDir } from '../utils';
import { readJSON } from 'fs-extra';
import path from 'path';
import { Logger } from '@tikkhun/logger';

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

// 已经带有 templates
export async function withTemplatesDir(templatesDir: string) {
  const template = await TemplateChooser({ templatesDir });
  const creatorCli = new Cli({ ...creatorCliOptions, excludeOptions: ['template'] });
  let templateOptions: any;
  try {
    templateOptions = (await readJSON(path.join(template, 'template.json'))) || {};
    Logger.log('模板默认选项', templateOptions);
  } catch (error: any) {
    Logger.warn(`读取templateOptions失败,原因为：` + error.message);
  }
  creatorCli.start(async (options) => {
    const creator = new Creator({
      ...options,
      ...templateOptions,
      template,
      // 其他选项怎么办
    });
    await creator.start();
  });
}
