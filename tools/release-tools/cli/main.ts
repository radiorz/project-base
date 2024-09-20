#!/usr/bin/env node
import { Cli, CommandTypes } from '@tikkhun/cli-core';
import { Release } from '../lib';
import packageJson from '../package.json';
const cli = new Cli({
  types: [CommandTypes.args, CommandTypes.config, CommandTypes.prompts],
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  // 这里可以用config进行配置
  defaultOptions: Release.defaultOptions,
  excludeOptions: [
    //
    'projectInfoOptions.workspace',
  ],
  optionTypes: {
    workspace: 'string',
    include: 'array',
    exclude: 'array',
    archiveType: 'string',
    releasePath: 'string',
    clean: 'boolean',
    projectInfoOptions: {
      projectName: 'string',
      withVersion: 'boolean',
      withTime: 'boolean',
      timePattern: 'string',
      versionTag: 'string',
      environment: 'string',
    },
  },
  optionTitles: {
    workspace: '项目根目录',
    include: '包含问界',
    exclude: '排除文件',
    archiveType: '打包类型',
    archiveOptions: '打包选项',
    clean: '清空旧记录',
    releasePath: '释放文件夹',
    projectInfoOptions: {
      projectName: '项目名称',
      withVersion: '带有版本',
      versionTag: '版本标志',
      withTime: '带有时间',
      timePattern: '时间格式',
      environment: '环境参数',
    },
  },
});
cli.start(async (option) => {
  const release = new Release(option);
  await release.start();
});
