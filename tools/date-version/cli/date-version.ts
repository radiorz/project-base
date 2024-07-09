import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import {
  DateVersionGetter,
  DEFAULT_DATE_VERSION_GETTER_OPTIONS,
  DEFAULT_JSON_STORE_OPTIONS,
  JsonStore,
  VersionManager
} from '../lib';
Logger.log('[欢迎] version');

interface UpdateJsonVersionOptions {
  format: string;
  path: string;
}
program
  .command('update')
  .description('更新JSON')
  .option('-f --format <format>', '日期格式', DEFAULT_DATE_VERSION_GETTER_OPTIONS.pattern)
  .option('-p --path <filePath>', 'json文件路径', DEFAULT_JSON_STORE_OPTIONS.file)
  .action(async (options: UpdateJsonVersionOptions) => {
    const versionManager = new VersionManager({
      getter: new DateVersionGetter({
        pattern: options.format,
      }),
      store: new JsonStore({
        file: options.path,
        key: 'version',
      }),
    });
    const result = await versionManager.update();
    if (result) {
      Logger.debug!('package json 的版本更新成功');
    }
  });

program
  .command('get')
  .description('获取版本')
  .option('-f --format <format>', '日期格式', DEFAULT_DATE_VERSION_GETTER_OPTIONS.pattern)
  .action(({ format }: any) => {
    const getter = new DateVersionGetter({ pattern: format });
    Logger.log(getter.get());
  });

program.parse(process.argv);
