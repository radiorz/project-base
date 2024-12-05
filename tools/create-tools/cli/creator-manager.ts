#!/usr/bin/env node

import { Cli } from '@tikkhun/cli-core';
import { checkNodeVersion, Creator, echoPackage, getTemplates, TemplateChooser } from '../lib';
import packageJson from '../package.json';
import { templatesDir } from '../lib/utils';
import { select } from '@inquirer/prompts';
import { readJSON } from 'fs-extra';
import path from 'path';
checkNodeVersion(12);
echoPackage();
const creatorManagerCli = new Cli({
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  optionTitles: {
    templatesDir: '模板存放路径',
  },
  optionTypes: {
    templatesDir: 'string',
  },
});

creatorManagerCli.start(async ({ templatesDir }: { templatesDir: string }) => {
  // 给定的 templatesDir 可以有两种形式，一种是全局依赖（@tikkhun/create-tsup)，一种是github 一种是。。。
  // 目的就是找到 template ，然后让用户选择，然后就进行项目拷贝创建
  const template = await TemplateChooser({ templatesDir });
  const templateInfo = await readJSON(path.resolve(templatesDir, template, 'template.json'));
  const creator = new Creator({
    ...templateInfo,
    template,
  });
  await creator.start();
});
