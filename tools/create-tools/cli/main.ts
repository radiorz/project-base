#!/usr/bin/env node
import { Creator } from '../lib';
import { Cli } from '@tikkhun/cli-core';
import packageJson from '../package.json';

const cli = new Cli({
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  defaultOptions: Creator.DEFAULT_OPTIONS,
  excludeOptions: ['projectDirOptions.build'],
  optionTitles: {
    workspace: '目标文件夹', // template 复制到的位置
    template: '模板路径', // template 的位置
    templateExclude: '不包含的一些文件', // 排除不复制的内容
    projectName: '项目名称', // 项目名称
    templateFiles: '需ejs模板替换的文件', // 根据文件路径定位
    replaces: '需移动的一些文件',
    projectDirOptions: {
      prefix: '[项目文件名]前缀',
      suffix: '[项目文件名]后缀',
      delimiter: '[项目文件名]分隔符',
    },
  },
  optionTypes: {
    workspace: 'string', // template 复制到的位置
    template: 'string', // template 的位置
    templateExclude: 'array', // 排除不复制的内容
    projectName: 'string', // 项目名称
    templateFiles: 'array', // 根据文件路径定位
    replaces: 'keyValueArray',
    projectDirOptions: {
      prefix: 'string',
      suffix: 'string',
      delimiter: 'string',
    },
  },
});
cli?.argsCommand?.program!.command('question').action(() => {
  import('./prompts');
});
cli.start(async (options: any) => {
  const inst = new Creator(options);
  await inst.start();
});
