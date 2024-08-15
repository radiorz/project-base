#!/usr/bin/env node

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
  const projectName = await input({ message: '项目名称', default: Creator.DEFAULT_OPTIONS.projectName });
  const template = await select({
    message: '模块名称',
    choices: [
      {
        value: 'lib',
        // name: '默认',
      },
      {
        value: 'cli',
        // name: 'esmodule 模板',
      },
    ],
  });
  const creator = new Creator({
    projectName,
    template: join(dirname(fileURLToPath(import.meta.url)), '../templates', template),
    templateFiles: ['package.json', 'README.md'],
  });
  await creator.start();
}
bootstrap();
