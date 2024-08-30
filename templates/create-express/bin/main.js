#!/usr/bin/env node

import { Creator, checkNodeVersion, echoPackage } from '@tikkhun/create';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { input, select } from '@inquirer/prompts';
const templateDir = join(dirname(fileURLToPath(import.meta.url)), '../templates');
async function getChoices() {
  // 读取本目录下的template清单
  const results = await glob('*', {
    cwd: templateDir,
  });
  // console.log(`results`,results)
  return results.map((filePath) => {
    return {
      value: filePath,
    };
  });
}
async function bootstrap() {
  checkNodeVersion(12);
  echoPackage();
  const projectName = await input({ message: '项目名称', default: Creator.DEFAULT_OPTIONS.projectName });
  const template = await select({
    message: '模块名称',
    choices: await getChoices(),
  });
  const creator = new Creator({
    projectName,
    template: join(templateDir, template),
    templateFiles: ['package.json', 'README.md'],
  });
  await creator.start();
}
bootstrap();
