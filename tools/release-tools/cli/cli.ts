#!/usr/bin/env node
import { Cli } from '@tikkhun/cli-core';
import { Release, DEFAULT_RELEASE_OPTIONS } from '../lib';
import packageJson from '../package.json';
import { Logger } from '@tikkhun/logger';
Logger.debug!(`[欢迎使用] ${packageJson.name} ${packageJson.version}`);
const cli = new Cli({
  version: packageJson.version,
  description: packageJson.description,
  defaultOptions: DEFAULT_RELEASE_OPTIONS,
  excludeOptions: [
    //
    'releaseFileNameOptions.releaseFileNameBuilder',
    'releaseFileNameOptions.workspace',
  ],
  optionTypes: {
    workspace: 'string',
    include: 'array',
    exclude: 'array',
    archiveType: 'string',
    archiveOptions: { zlib: { level: 'number' } },
    releasePath: 'string',
    clean: 'boolean',
    releaseFileNameOptions: {
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
    releaseFileNameOptions: {
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
