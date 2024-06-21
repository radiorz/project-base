#!/usr/bin/env node
import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { Creator, DEFAULT_OPTIONS } from './Creator';
import packageJson from '../package.json';
const name = packageJson.name;
Logger.log(`[欢迎使用] ${name}`);

program
  .description('打包')
  .option('--template <template>', '模板路径', DEFAULT_OPTIONS.template)
  .option('--templateExclude <templateExclude>', '不包含的一些文件', DEFAULT_OPTIONS.templateExclude.toString())
  .option('--projectName <projectName>', '项目名', DEFAULT_OPTIONS.projectName)
  .option('--workspace <workspace>', '根路径', DEFAULT_OPTIONS.workspace)
  .option('--templateFiles <templateFiles>', '需模板替换的文件', DEFAULT_OPTIONS.templateFiles.toString())
  .option('--replaces <replaces>', '替换名称的路径', '')
  .action(async (options: any) => {
    const opts = {
      ...options,
      templateExclude: options.templateExclude.split(','),
      templateFiles: options.templateFiles.split(','),
      replaces:
        options.replaces &&
        options.replaces.split(',').map((str: string) => {
          if (!str) return;
          const [sourcePath, targetPath] = str.split('=');
          if (!sourcePath || !targetPath) {
            return;
          }
          return {
            sourcePath,
            targetPath,
          };
        }),
    };
    const inst = new Creator(opts);
    await inst.start();
  });
program.parse(process.argv);
