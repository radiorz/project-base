#!/usr/bin/env node
import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import { getDateVersion, DEFAULT_DATE_VERSION_GETTER_OPTIONS } from '@tikkhun/date-version';
import { DEFAULT_JSON_STORE_OPTIONS, JsonStore, VersionManager } from '../lib';
import { findUp } from '@tikkhun/utils';
Logger.log('[欢迎] date-version');

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
    const filePath = findUp(options.path, process.cwd()); // 向上查找直到找到
    if (!filePath) throw new Error(`更新版本号，但失败，无法获取${options.path}文件路径`);
    Logger.debug!('更新的文件路径: ' + filePath);
    const versionManager = new VersionManager({
      getter: {
        get() {
          return getDateVersion();
        },
      },
      store: new JsonStore({
        file: options.path,
        key: 'version',
      }),
    });
    const result = await versionManager.update();
    if (result) {
      // TODO 这里需要打印结果（new version old version)
      Logger.debug!('package json 的版本更新成功');
    }
  });

program
  .command('get')
  .description('获取版本')
  .option('-p --pattern <pattern>', '日期格式', DEFAULT_DATE_VERSION_GETTER_OPTIONS.pattern)
  .action(({ pattern }: { pattern: string }) => {
    Logger.log(getDateVersion({ pattern }));
  });

program.parse(process.argv);
