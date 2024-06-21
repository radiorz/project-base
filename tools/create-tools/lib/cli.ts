#!/usr/bin/env node

import inquirer, { QuestionCollection } from 'inquirer';
import { DEFAULT_OPTIONS, Creator } from './Creator';
import { checkNodeVersion } from './node';
checkNodeVersion(12);
const prompts: QuestionCollection = [
  {
    type: 'input',
    name: 'projectName',
    default: DEFAULT_OPTIONS.projectName,
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
  const options = await inquirer.prompt(prompts);
  const creator = new Creator(options);
  await creator.start();
}
bootstrap();
