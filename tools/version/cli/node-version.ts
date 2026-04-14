#!/usr/bin/env node
import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import { NodeVersionGetter, VersionManager } from '../lib';
import { printManagerResult, resolveTarget, TargetCommandOptions } from './shared';
Logger.log('[欢迎] node-version');

/**
 * @description Node 版本目标参数.
 */
interface NodeVersionCommandOptions extends TargetCommandOptions {}

program
  .command('save')
  .description('获取当前 Node 版本并写入目标文件')
  .option('-F --file <filePath>', '目标文件路径', '.node-version')
  .option('-t --type <type>', '目标文件类型', 'text')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .option('--replacement <replacement>', '文本替换模板', '{{version}}')
  .option('--create-if-not-exists', '文件不存在时自动创建', true)
  .action(async (options: NodeVersionCommandOptions) => {
    const versionManager = new VersionManager({
      getter: new NodeVersionGetter(),
      targets: [resolveTarget(options)],
    });
    const result = await versionManager.update();
    printManagerResult(result);
  });

program
  .command('get')
  .description('获取当前 Node 版本')
  .action(async () => {
    const getter = new NodeVersionGetter();
    Logger.log(await getter.get());
  });

program
  .command('read')
  .description('读取目标文件中的版本')
  .option('-F --file <filePath>', '目标文件路径', '.node-version')
  .option('-t --type <type>', '目标文件类型', 'text')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .action(async (options: NodeVersionCommandOptions) => {
    const versionManager = new VersionManager({
      targets: [resolveTarget(options)],
    });
    const result = await versionManager.read();
    printManagerResult(result);
  });

program
  .command('set')
  .description('把指定版本值写入目标文件')
  .argument('<value>', '版本值')
  .option('-F --file <filePath>', '目标文件路径', '.node-version')
  .option('-t --type <type>', '目标文件类型', 'text')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .option('--replacement <replacement>', '文本替换模板', '{{version}}')
  .option('--create-if-not-exists', '文件不存在时自动创建', true)
  .action(async (value: string, options: NodeVersionCommandOptions) => {
    const versionManager = new VersionManager({
      targets: [resolveTarget(options)],
    });
    const result = await versionManager.set(value);
    printManagerResult(result);
  });

program.parse(process.argv);
