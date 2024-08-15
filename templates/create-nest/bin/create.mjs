#!/usr/bin/env node

import { Creator, checkNodeVersion, echoPackage } from '@tikkhun/create';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

async function bootstrap() {
  const projectName = await input({ message: '项目名称', default: Creator.DEFAULT_OPTIONS.projectName });
  const template = await select({
    message: '模块名称',
    choices: [
      {
        value: 'lib',
        // name: '默认',
      },
      {
        value: 'app',
        // name: 'esmodule 模板',
      },
    ],
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
