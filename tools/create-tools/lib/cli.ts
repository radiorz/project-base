#!/usr/bin/env node
import { program } from 'commander';
import { Creator, DEFAULT_OPTIONS } from './Creator';
import { echoPackage } from './package';
import { OptionHandler } from '@tikkhun/cli-core';
echoPackage();
const stringDefaultOptions = OptionHandler.toString(DEFAULT_OPTIONS);
program
  .description('打包')
  .option('--template <template>', '模板路径', stringDefaultOptions.template)
  .option('--templateExclude <templateExclude>', '不包含的一些文件', stringDefaultOptions.templateExclude)
  .option('--projectName <projectName>', '项目名', stringDefaultOptions.projectName)
  .option('--workspace <workspace>', '根路径', stringDefaultOptions.workspace)
  .option('--templateFiles <templateFiles>', '需模板替换的文件', stringDefaultOptions.templateFiles)
  .option('--replaces <replaces>', '替换名称的路径', stringDefaultOptions.replaces)
  .action(async (options: any) => {
    const opts = OptionHandler.toType(options, {
      template: 'string',
      projectName: 'string',
      workspace: 'string',
      templateExclude: 'array',
      templateFiles: 'array',
      replaces: 'keyValueArray',
    });
    const inst = new Creator(opts);
    await inst.start();
  });
program.command('question').action(() => {
  import('./cli-question');
});
program.parse(process.argv);
