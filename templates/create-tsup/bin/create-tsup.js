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
    message: '模板名称',
    choices: ['lib', 'cli'],
  },
];
async function bootstrap() {
  checkNodeVersion(12);
  echoPackage();
  let options = await inquirer.prompt(prompts);
  const creator = new Creator({
    ...options,
    template: join(dirname(fileURLToPath(import.meta.url)), '../templates'),
    templateFiles: ['package.json', 'README.md'],
  });
  await creator.start();
}
bootstrap();
