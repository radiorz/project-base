import { Cli, CommandTypes } from '@tikkhun/cli-core';
import { Logger } from '@tikkhun/logger';
import fsExtra from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import packageJson from '../../package.json';
import { Creator } from '../Creator';
import { TemplateChooser } from '../TemplateChooser';
import { templatesDir as defaultTemplatesDir } from '../utils';
import { creatorCliOptions } from './creator-cli';
const { omit } = _;
const { readJSON } = fsExtra;

export const creatorManagerCliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  types: [CommandTypes.info, CommandTypes.args, CommandTypes.prompts],
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
export async function withTemplatesDir(templatesDir: string = defaultTemplatesDir) {
  const template = await TemplateChooser({ templatesDir });
  const creatorCli = new Cli({
    ...creatorCliOptions,
    excludeOptions: [...creatorCliOptions.excludeOptions, 'template'],
    immediatelyWelcome: true,
  });
  // console.log(`creatorCli`, creatorCli);
  let templateOptions: any;
  try {
    templateOptions = (await readJSON(path.join(template, 'template.json'))) || {};
    Logger.log('模板默认选项: ' + JSON.stringify(templateOptions));
  } catch (error: any) {
    Logger.warn(`读取templateOptions失败,原因为：` + error.message);
  }
  creatorCli.start(async (options) => {
    const creator = new Creator({
      ...options,
      ...templateOptions,
      template,
    });
    await creator.start();
  });
}
