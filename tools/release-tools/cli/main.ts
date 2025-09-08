#!/usr/bin/env node
import { Cli, CommandTypes } from '@tikkhun/cli-core';
import { TikkhunRelease, TikkhunReleaseDefaultOptions } from '../lib';
import packageJson from '../package.json';
const cli = new Cli({
  types: [CommandTypes.info, CommandTypes.args, CommandTypes.config, CommandTypes.prompts],
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  // 这里可以用config进行配置
  defaultOptions: TikkhunReleaseDefaultOptions,
  excludeOptions: [],
  optionTypes: {
    workspace: 'string',
    include: 'array',
    exclude: 'array',
    archiveType: 'string',
    releasePathRelative: 'string',
    releasePath: 'string',
    clean: 'boolean',
    getInfoOptions: {
      from: 'objectArray',
    },
    inputMoveOptions: {
      items: 'objectArray', // 实际上是 objectArray
    },
    infoStoreOptions: {
      enabled: 'boolean',
      path: 'string',
      transformMap: 'object',
      releasedAtPattern: 'string',
    },
    releaseNameOptions: {
      params: 'array',
      paramDelimiter: 'string',
      paramTransformers: 'object',
    },
  },
  optionTitles: {
    workspace: '[打包发布]项目根目录',
    include: '[打包发布]包含文件(glob)',
    exclude: '[打包发布]排除文件(glob)',
    archiveType: '[打包发布]压缩类型',
    archiveOptions: '[打包发布]压缩选项',
    clean: '[打包发布]清空旧记录',
    releasePathRelative: '[打包发布]存储文件夹路径的相对位置',
    releasePath: '[打包发布]存储文件夹路径',
    inputMoveOptions: {
      items: '[移动文件文件夹]文件夹列表',
    },
    getInfoOptions: {
      from: '[信息管理]项目信息来源',
    },
    infoStoreOptions: {
      enabled: '[信息存储]开启',
      path: '[信息存储]路径',
      transformMap: '[信息存储]转换映射规则',
      releasedAtPattern: '[信息存储]时间格式(pattern)',
    },
    releaseNameOptions: {
      params: '[释放文件名]参数列表',
      paramDelimiter: '[释放文件名]参数分隔符',
      paramTransformers: '[释放文件名]参数转换规则({[param]: deleteScope | patternLike })',
    },
  },
});
cli.start(async (option: any) => {
  // console.log(`option!!!!`,option)
  await TikkhunRelease(option);
});
