#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import { join } from 'path';
import { checkNodeVersion, Creator, echoPackage, getTemplates, templatesDir } from '../lib';
checkNodeVersion(12);
echoPackage();

async function bootstrap() {
  const projectName = await input({ message: '项目名称', default: Creator.DEFAULT_OPTIONS.projectName });
  const templates = await getTemplates(templatesDir);
  const template = await select({
    message: '模块名称',
    choices: templates.map((filePath) => ({
      value: filePath,
    })),
  });
  const creator = new Creator({ projectName, template: join(templatesDir, template) });
  await creator.start();
}

bootstrap();
