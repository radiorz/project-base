#!/usr/bin/env node

import inquirer, { QuestionCollection } from 'inquirer';
import { DEFAULT_OPTIONS, Creator, libDir } from './Creator';
import { checkNodeVersion } from './node';
import { join } from 'path';
checkNodeVersion(12);
const prompts: QuestionCollection = [
  {
    type: 'input',
    name: 'projectName',
    default: DEFAULT_OPTIONS.projectName,
    message: '项目名称',
  },
  {
    type: 'list',
    name: 'template',
    message: '内置模板名称',
    default: 'default',
    choices: ['default', 'one-mjs'],
  },
];
async function bootstrap() {
  const options = await inquirer.prompt(prompts);
  const creator = new Creator({ ...options, template: join(libDir, 'templates', options.template) });
  await creator.start();
}
bootstrap();
