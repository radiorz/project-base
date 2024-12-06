#!/usr/bin/env node

import { Cli } from '@tikkhun/cli-core';
import { Creator, TemplateChooser, creatorManagerCliOptions } from '@tikkhun/create';
import { Logger } from '@tikkhun/logger';
import fsExtra from 'fs-extra';
const { readJSON } = fsExtra;
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const myCreatorManagerCli = new Cli({
  ...creatorManagerCliOptions,
  excludeOptions: [...creatorManagerCliOptions.excludeOptions, 'templatesDir'],
});
myCreatorManagerCli.start(async ({ ...userCreatorOptions }) => {
  const templatesDir = join(dirname(fileURLToPath(import.meta.url)), '../templates');
  // 给定的 templatesDir 可以有两种形式，一种是全局依赖（@tikkhun/create-tsup)，一种是github 一种是。。。
  // 目的就是找到 template ，然后让用户选择，然后就进行项目拷贝创建
  const template = await TemplateChooser({ templatesDir });
  let templateOptions;
  try {
    templateOptions = (await readJSON(path.join(template, 'template.json'))) || {};
    Logger.log('模板默认选项', templateOptions);
  } catch (error) {
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
