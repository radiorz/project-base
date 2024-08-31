#!/usr/bin/env node

import { Creator, checkNodeVersion, echoPackage } from '@tikkhun/create';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const templateDir = join(dirname(fileURLToPath(import.meta.url)), '../templates');
async function getTemplates() {
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
  const projectName = await input({ message: '项目名称', default: Creator.DEFAULT_OPTIONS.projectName });
  const template = await select({
    message: '模块名称',
    choices: getTemplates,
  });
  checkNodeVersion(12);
  echoPackage();
  const creator = new Creator({
    projectName,
    template: join(dirname(fileURLToPath(import.meta.url)), `../templates/${template}`),
  });
  await creator.start();
}
bootstrap();
