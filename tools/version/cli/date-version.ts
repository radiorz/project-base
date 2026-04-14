#!/usr/bin/env node
import { Logger } from '@tikkhun/logger';
import { program } from 'commander';
import { getDateVersion, DEFAULT_DATE_VERSION_GETTER_OPTIONS } from '@tikkhun/date-version';
import { DEFAULT_JSON_STORE_OPTIONS, VersionManager } from '../lib';
import { printManagerResult, resolveTarget, TargetCommandOptions } from './shared';
Logger.log('[欢迎] date-version');

/**
 * @description 日期版本更新参数.
 */
interface DateVersionCommandOptions extends TargetCommandOptions {
  /**
   * @description 日期格式.
   */
  format: string;
}

program
  .command('update')
  .description('生成日期版本并写入目标文件')
  .option('-f --format <format>', '日期格式', DEFAULT_DATE_VERSION_GETTER_OPTIONS.pattern)
  .option('-F --file <filePath>', '目标文件路径', DEFAULT_JSON_STORE_OPTIONS.file)
  .option('-t --type <type>', '目标文件类型', 'json')
  .option('-k --key <key>', '兼容旧版 key 参数', DEFAULT_JSON_STORE_OPTIONS.key)
  .option('--path <path>', '结构化路径')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .option('--replacement <replacement>', '文本替换模板', '{{version}}')
  .option('--create-if-not-exists', '文件不存在时自动创建', false)
  .action(async (options: DateVersionCommandOptions) => {
    const versionManager = new VersionManager({
      getter: {
        get() {
          return getDateVersion({ pattern: options.format });
        },
      },
      targets: [resolveTarget(options)],
    });
    const result = await versionManager.update();
    printManagerResult(result);
  });

program
  .command('get')
  .description('生成日期版本')
  .option('-p --pattern <pattern>', '日期格式', DEFAULT_DATE_VERSION_GETTER_OPTIONS.pattern)
  .action(({ pattern }: { pattern: string }) => {
    Logger.log(getDateVersion({ pattern }));
  });

program
  .command('read')
  .description('读取目标文件中的版本')
  .option('-F --file <filePath>', '目标文件路径', DEFAULT_JSON_STORE_OPTIONS.file)
  .option('-t --type <type>', '目标文件类型', 'json')
  .option('-k --key <key>', '兼容旧版 key 参数', DEFAULT_JSON_STORE_OPTIONS.key)
  .option('--path <path>', '结构化路径')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .action(async (options: TargetCommandOptions) => {
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
  .option('-F --file <filePath>', '目标文件路径', DEFAULT_JSON_STORE_OPTIONS.file)
  .option('-t --type <type>', '目标文件类型', 'json')
  .option('-k --key <key>', '兼容旧版 key 参数', DEFAULT_JSON_STORE_OPTIONS.key)
  .option('--path <path>', '结构化路径')
  .option('--mode <mode>', '文本模式. raw 或 replace', 'raw')
  .option('--pattern <pattern>', '文本替换正则')
  .option('--replacement <replacement>', '文本替换模板', '{{version}}')
  .option('--create-if-not-exists', '文件不存在时自动创建', false)
  .action(async (value: string, options: TargetCommandOptions) => {
    const versionManager = new VersionManager({
      targets: [resolveTarget(options)],
    });
    const result = await versionManager.set(value);
    printManagerResult(result);
  });

program.parse(process.argv);
