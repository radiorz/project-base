#!/usr/bin/env node

import inquirer from 'inquirer';
import { Creator, checkNodeVersion } from '@tikkhun/create-tools';
const prompts = [
  {
    type: 'input',
    name: 'projectName',
    message: '项目名称',
  },
  // {
  //   type: 'list',
  //   name: 'lang',
  //   message: 'JS/TS',
  //   choices: ['JavaScript', 'TypeScript'],
  // },
];
async function bootstrap() {
  checkNodeVersion(12);
  let options = await inquirer.prompt(prompts);
  const creator = new Creator({ ...options, template: './template' });
  await creator.start();
}
bootstrap();
