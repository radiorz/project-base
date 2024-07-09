#!/usr/bin/env node
import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import {
  SemanticVersionGetter,
  DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS,
  DEFAULT_JSON_STORE_OPTIONS,
  JsonStore,
  VersionManager,
  Positions,
} from '../lib';
Logger.log('[欢迎] date-version');

interface UpdateJsonVersionOptions {
  format: string;
  path: string;
}
program
  .command('update')
  .description('更新')
  .option('-p --position <position>', '更新位置', Positions[DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.position])
  .option('-f --file <filePath>', 'json文件路径', DEFAULT_JSON_STORE_OPTIONS.file)
  .action(async (options) => {
    const position = Positions[options.position as keyof typeof Positions];
    const versionManager = new VersionManager({
      getter: new SemanticVersionGetter({ position, file: options.file }),
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
  .option('-p --position <position>', '更新位置', Positions[DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.position])
  .action(async (options: any) => {
    const position = Positions[options.position as keyof typeof Positions];
    const getter = new SemanticVersionGetter({ position: position });
    Logger.log(await getter.get());
  });

program.parse(process.argv);
