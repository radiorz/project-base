#!/usr/bin/env node

import { Cli, CommandTypes } from '@tikkhun/cli-core';
import { Logger } from '@tikkhun/logger';
import { readJSON } from 'fs-extra';
import { omit } from 'lodash';
import path from 'path';
import { Creator, TemplateChooser } from '../lib';
import packageJson from '../package.json';
import { creatorCliOptions } from './creator-cli';

const creatorManagerCliOptions = {
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
const creatorManagerCli = new Cli(creatorManagerCliOptions);

creatorManagerCli.start(async ({ templatesDir, ...userCreatorOptions }: any) => {
  // 给定的 templatesDir 可以有两种形式，一种是全局依赖（@tikkhun/create-tsup)，一种是github 一种是。。。
  // 目的就是找到 template ，然后让用户选择，然后就进行项目拷贝创建
  const template = await TemplateChooser({ templatesDir });
  let templateOptions;
  try {
    templateOptions = (await readJSON(path.join(template, 'template.json'))) || {};
    Logger.log('模板默认选项', templateOptions);
  } catch (error: any) {
    Logger.warn(`读取templateOptions失败,原因为：` + error.message);
  }
  const creator = new Creator({
    ...userCreatorOptions,
    ...templateOptions,
    template,
    // 其他选项怎么办
  });
  await creator.start();
});
