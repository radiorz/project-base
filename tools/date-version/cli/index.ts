import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { VersionManager, JsonStore, TextStore, DateVersionGetter, NodeVersionGetter } from '../lib';
Logger.log('[欢迎] version');

interface UpdateJsonVersionOptions {
  format: string;
  path: string;
}
program
  .command('updateJsonVersion')
  .description('更新JSON')
  .option('-f --format <format>', '日期格式')
  .option('-p --path <filePath>', 'json文件路径')
  .action((options: UpdateJsonVersionOptions) => {
    const versionManager = new VersionManager({
      getter: new DateVersionGetter({
        pattern: options.format,
      }),
      store: new JsonStore({
        file: options.path,
        key: 'version',
      }),
    });
    versionManager.update();
  });

program
  .command('get')
  .description('获取版本')
  .option('-f --format <format>', '日期格式')
  .action(({ format }: any) => {
    const getter = new DateVersionGetter({ pattern: format });
    Logger.log(getter.get());
  });
// node version
program
  .command('node-version')
  .description('保存版本')
  .action(() => {
    const versionManager = new VersionManager({
      getter: new NodeVersionGetter(),
      store: new TextStore({ file: '.node-version' }),
    });
    versionManager.update();
  });
program.parse(process.argv);
