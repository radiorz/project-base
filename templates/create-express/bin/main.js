#!/usr/bin/env node

import { Creator, checkNodeVersion, echoPackage, getTemplates } from '@tikkhun/create';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { input, select } from '@inquirer/prompts';
const templatesDir = join(dirname(fileURLToPath(import.meta.url)), '../templates');
async function bootstrap() {
  checkNodeVersion(12);
  echoPackage();
  const projectName = await input({ message: '项目名称', default: Creator.DEFAULT_OPTIONS.projectName });
  const template = await select({
    message: '模块名称',
    choices: (await getTemplates(templatesDir)).map((filePath) => {
      return {
        value: filePath,
      };
    }),
  });
  const creator = new Creator({
    projectName,
    template: join(templatesDir, template),
    templateFiles: ['package.json', 'README.md'],
  });
  await creator.start();
}
bootstrap();
