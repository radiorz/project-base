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
  excludeOptions: [],
  optionTypes: {
    workspace: 'string',
    include: 'array',
    exclude: 'array',
    archiveType: 'string',
    releasePath: 'string',
    clean: 'boolean',
    projectInfoOptions: {
      workspace: 'string',
      projectName: 'string',
      withVersion: 'boolean',
      withReleasedAt: 'boolean',
      timePattern: 'string',
      versionTag: 'string',
      environment: 'string',
      file: {
        enabled: 'boolean',
        path: 'string',
      },
      fileName: {
        enabled: 'boolean',
      },
    },
  },
  optionTitles: {
    workspace: '项目打包根目录',
    include: '包含文件(glob)',
    exclude: '排除文件(glob)',
    archiveType: '打包类型',
    archiveOptions: '打包选项',
    clean: '清空旧记录',
    releasePath: '释放文件夹',
    projectInfoOptions: {
      workspace: '项目根目录',
      projectName: '项目名称',
      withVersion: '带有版本',
      versionTag: '版本标志',
      withReleasedAt: '带有释放时间点',
      timePattern: '时间格式',
      environment: '环境参数',
      file: {
        enabled: '保存到文件',
        path: '保存文件的路径',
      },
      fileName: {
        enabled: '保存到文件名',
      },
    },
  },
});
cli.start(async (option: any) => {
  const release = new Release(option);
  await release.start();
});
