#!/usr/bin/env node
import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import {
  DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS,
  JsonStore,
  Positions,
  SemanticVersionGetter,
  VersionManager
} from '../lib';
Logger.log('[欢迎] semantic-version');

program
  .command('update')
  .description('更新')
  .option('-p --position <position>', '更新位置', Positions[DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.position])
  .option('-f --file <filePath>', 'json文件路径', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.file)
  .action(async (options) => {
    const position = Positions[options.position as keyof typeof Positions];
    const versionManager = new VersionManager({
      getter: new SemanticVersionGetter({ position, file: options.file }),
      store: new JsonStore({
        file: options.file,
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
