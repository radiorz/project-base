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
import { findUp } from '@tikkhun/utils';
import { join } from 'path';
Logger.log('[欢迎] semantic-version');

program
  .command('update')
  .description('更新')
  .option('-p --position <position>', '更新位置<major,minor,patch>', Positions[DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.position])
  .option('-f --file <fileName>', 'json文件名称', DEFAULT_SEMANTIC_VERSION_GETTER_OPTIONS.file)
  .action(async (options) => {
    const position = Positions[options.position as keyof typeof Positions];
    // 这里提供了向上查找package.json等配置的能力
    const filePath = findUp(join(process.cwd(), options.file)); // 向上查找直到找到
    if (!filePath) throw new Error(`更新版本号，但失败，无法获取${options.file}文件路径`)
    Logger.debug!("filePath", filePath)
    const versionManager = new VersionManager({
      getter: new SemanticVersionGetter({ position, file: filePath }),
      store: new JsonStore({
        file: filePath,
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
