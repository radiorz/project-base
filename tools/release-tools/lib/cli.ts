#!/usr/bin/env node
import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { Release, DEFAULT_OPTIONS } from './Release';
import packageJson from '../package.json';
const name = packageJson.name;
Logger.log(`[欢迎使用] ${name}`);

program
  .description('打包')
  .option('--workspace <workspace>', '根路径', DEFAULT_OPTIONS.workspace)
  .option('--include <include>', '包含', DEFAULT_OPTIONS.include.toString())
  .option('--exclude <exclude>', '不包含', DEFAULT_OPTIONS.exclude.toString())
  .option('--releaseName <releaseName>', '打包名称', DEFAULT_OPTIONS.releaseName)
  .option('--withVersion <withVersion>', '需要版本号', '' + DEFAULT_OPTIONS.withVersion)
  .option('--withTime <withTime>', '需要打包时间', '' + DEFAULT_OPTIONS.withTime)
  .option('--timePattern <timePattern>', '版本号样式', DEFAULT_OPTIONS.timePattern)
  .option('--archiveType <archiveType>', '打包格式', DEFAULT_OPTIONS.archiveType)
  .action((options: any) => {
    const { include, exclude, withVersion, withTime } = options;
    const opts = {
      ...options,
      include: include.split(','),
      exclude: exclude.split(','),
      withVersion: withVersion === 'true',
      withTime: withTime === 'true',
    };
    const release = new Release(opts);
    release.start();
  })
  .help();
program.parse(process.argv);
