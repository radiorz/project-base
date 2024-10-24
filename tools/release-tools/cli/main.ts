#!/usr/bin/env node
import { Cli, CommandTypes } from '@tikkhun/cli-core';
import { InputMovePlugin, TikkhunRelease, TikkhunReleaseDefaultOptions } from '../lib';
import packageJson from '../package.json';
const cli = new Cli({
  types: [CommandTypes.args, CommandTypes.config, CommandTypes.prompts],
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
    infoBuilderOptions: {
      workspace: 'string',
      configType: 'string',
      mainFilePath: 'string',
      input: {
        name: 'string',
        title: 'string',
        version: 'string',
        description: 'string',
        tag: 'string',
        system: 'string',
        hardware: 'string',
      },
    },
    inputMoveOptions: {
      items: 'array',
    },
    infoStoreOptions: {
      enabled: 'boolean',
      path: 'string',
      transformMap: 'Object',
      releasedAtPattern: 'string',
    },
    releaseNameOptions: {
      params: 'array',
      paramDelimiter: 'string',
      releasedAtPattern: 'string',
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
    infoBuilderOptions: {
      workspace: '[信息管理]项目信息根目录',
      configType: '[信息管理]配置文件类型("packageJson"|"androidXml")',
      mainFilePath: '[信息管理]文件路径(需要hash的文件)',
      input: {
        name: '[信息管理]项目名称',
        title: '[信息管理]项目中文名称',
        version: '[信息管理]项目版本',
        tag: '[信息管理]标志',
        description: '[信息管理]描述',
        system: '[信息管理]系统参数',
        hardware: '[信息管理]硬件参数',
      },
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
      releasedAtPattern: '[释放文件名]时间格式(pattern)',
    },
  },
});
cli.start(async (option: any) => {
  // console.log(`option!!!!`,option)
  await TikkhunRelease(option);
});
