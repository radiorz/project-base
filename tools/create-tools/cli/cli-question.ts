#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import { join } from 'path';
import { checkNodeVersion, Creator, echoPackage, libDir } from '../lib';
checkNodeVersion(12);
echoPackage();

async function bootstrap() {
  const projectName = await input({ message: '项目名称', default: Creator.DEFAULT_OPTIONS.projectName });
  const template = await select({
    message: '模块名称',
    choices: [
      {
        value: 'default',
        // name: '默认',
      },
      {
        value: 'one-mjs',
        // name: 'esmodule 模板',
      },
    ],
  });
  const creator = new Creator({ projectName, template: join(libDir, 'templates', template) });
  await creator.start();
}

bootstrap();
