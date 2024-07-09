#!/usr/bin/env node
import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import { NodeVersionGetter, TextStore, VersionManager } from '../lib';
Logger.log('[欢迎] node-version');

// node version
program
  .command('save')
  .description('保存版本')
  .action(async () => {
    const versionManager = new VersionManager({
      getter: new NodeVersionGetter(),
      store: new TextStore({ file: '.node-version' }),
    });
    const result = await versionManager.update();
    if (result) {
      Logger.debug!('node 版本更新成功');
    }
  });
program.parse(process.argv);
