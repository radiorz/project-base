#!/usr/bin/env node
import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { Release, DEFAULT_OPTIONS } from '../lib/Release';
import packageJson from '../package.json';
import { OptionHandler } from '@tikkhun/cli-utils';
const { name, version } = packageJson;
Logger.log(`[欢迎使用] ${name}`);
const stringDefaultOptions = OptionHandler.toString(DEFAULT_OPTIONS);
program
  .version(version)
  .description('打包')
  .option('--workspace <workspace>', '根路径', stringDefaultOptions.workspace)
  .option('--include <include>', '包含', stringDefaultOptions.include)
  .option('--exclude <exclude>', '不包含', stringDefaultOptions.exclude)
  .option('--releaseName <releaseName>', '打包名称', stringDefaultOptions.releaseName)
  .option('--releasePath <releasePath>', '打包存放位置', stringDefaultOptions.releasePath)
  .option('--withVersion <withVersion>', '需要版本号', stringDefaultOptions.withVersion)
  .option('--withTime <withTime>', '需要打包时间', stringDefaultOptions.withTime)
  .option('--timePattern <timePattern>', '版本号样式', stringDefaultOptions.timePattern)
  .option('--archiveType <archiveType>', '打包格式', stringDefaultOptions.archiveType)
  .action(async (options: any) => {
    const opts = OptionHandler.toType(options, {
      workspace: 'string',
      include: 'array',
      exclude: 'array',
      releaseName: 'string',
      releasePath: 'string',
      withVersion: 'boolean',
      withTime: 'boolean',
      timePattern: 'string',
      archiveType: 'string',
    });
    const release = new Release(opts);
    await release.start();
  });
program.parse(process.argv);
