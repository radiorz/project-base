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
      filePath: 'string',
      projectName: 'string',
      timePattern: 'string',
      versionTag: 'string',
      system: 'string',
      hardware: 'string',
      stringifyDelimiter: 'string',
      stringifyParams: 'array',
      jsonMap: 'object',
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
    workspace: '[打包发布]项目根目录',
    include: '[打包发布]包含文件(glob)',
    exclude: '[打包发布]排除文件(glob)',
    archiveType: '[打包发布]压缩类型',
    archiveOptions: '[打包发布]压缩选项',
    clean: '[打包发布]清空旧记录',
    releasePath: '[打包发布]存储文件夹路径',
    projectInfoOptions: {
      workspace: '[项目信息]项目根目录',
      filePath: '[项目信息]文件路径(需要hash的文件)',
      projectName: '[项目信息]项目名称',
      versionTag: '[项目信息]版本标志',
      timePattern: '[项目信息]时间格式',
      system: '[项目信息]系统参数',
      hardware: '[项目信息]硬件参数',

      stringifyDelimiter: '[项目信息]序列化分隔符',
      stringifyParams: '[项目信息]文件名序列化参数',

      jsonMap: '[项目信息]json存储对应表',

      infoFile: {
        enabled: '[项目信息|项目信息文件]开启',
        path: '[项目信息|项目信息文件]保存路径',
      },
      infoName: {
        enabled: '[项目信息|项目信息文件名]开启',
      },
    },
  },
});
cli.start(async (option: any) => {
  // console.log(`option!!!!`,option)
  const release = new Release(option);
  await release.start();
});
