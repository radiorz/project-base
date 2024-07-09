import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import {
  NodeVersionGetter,
  TextStore,
  VersionManager
} from '../lib';
Logger.log('[欢迎] version');

// node version
program
  .command('save')
  .description('保存版本')
  .action(() => {
    const versionManager = new VersionManager({
      getter: new NodeVersionGetter(),
      store: new TextStore({ file: '.node-version' }),
    });
    versionManager.update();
    Logger.debug!('node 版本更新成功');
  });
program.parse(process.argv);
