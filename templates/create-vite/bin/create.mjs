#!/usr/bin/env node

import inquirer from 'inquirer';
import { Creator, checkNodeVersion, echoPackage } from '@tikkhun/create';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: '项目名称',
  },
  {
    type: 'list',
    name: 'template',
    message: '项目模板',
    choices: ['lib', 'vuetify-lib'],
    // 手动输入
  },
];
async function bootstrap() {
  checkNodeVersion(12);
  echoPackage();
  let options = await inquirer.prompt(prompts);
  const creator = new Creator({
    ...options,
    template: join(dirname(fileURLToPath(import.meta.url)), `../templates/${options.template}`),
  });
  await creator.start();
}
bootstrap();
