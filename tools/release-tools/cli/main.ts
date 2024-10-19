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
      file: 'string',
      projectName: 'string',
      timePattern: 'string',
      versionTag: 'string',
      system: 'string',
      hardware: 'string',
      stringifyDelimiter: 'string',
      stringifyParams: 'array',
      // optionsMap: 'object',
      infoFile: {
        enabled: 'boolean',
        path: 'string',
      },
      infoName: {
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
      versionTag: '版本标志',
      stringifyDelimiter: '序列化分隔符',
      stringifyParams: '文件名序列化参数',
      timePattern: '时间格式',
      system: '系统参数',
      hardware: '硬件参数',
      infoFile: {
        enabled: '保存项目信息到文件',
        path: '保存项目信息的文件的路径',
      },
      infoName: {
        enabled: '保存项目信息到文件名',
      },
    },
  },
});
cli.start(async (option: any) => {
  // console.log(`option!!!!`,option)
  const release = new Release(option);
  await release.start();
});
