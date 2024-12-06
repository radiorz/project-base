#!/usr/bin/env node

import { Creator, checkNodeVersion, echoPackage, getTemplates } from '@tikkhun/create';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { input, select } from '@inquirer/prompts';
const templatesDir = join(dirname(fileURLToPath(import.meta.url)), '../templates');


import { Logger } from '@tikkhun/logger';
import { readJSON } from 'fs-extra';
import path from 'path';
import { Creator, TemplateChooser } from '../lib';
import { creatorManagerCli } from '../lib/cli/creator-manager-cli';
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
