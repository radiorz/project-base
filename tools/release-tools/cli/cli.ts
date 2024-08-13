#!/usr/bin/env node
import { Command, program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { Release, DEFAULT_RELEASE_OPTIONS, ReleaseFileNameOptions } from '../lib/Release';
import packageJson from '../package.json';
import { OptionHandler } from '@tikkhun/cli-utils';
import { jsonToList, listToJson } from '@tikkhun/utils-core';
const { name, version } = packageJson;
Logger.log(`[欢迎使用] ${name}`);
const stringDefaultOptions = OptionHandler.toString(DEFAULT_RELEASE_OPTIONS);
program.version(version);
const optionTypes = {
  workspace: 'string',
  include: 'array',
  exclude: 'array',
  archiveType: 'string',
  archiveOptions: { zlib: { level: 'number' } },
  releasePath: 'string',
  clean: 'boolean',
  //
  releaseFileNameOptions: {
    projectName: 'string',
    withVersion: 'boolean',
    withTime: 'boolean',
    timePattern: 'string',
    versionTag: 'versionTag',
    environment: 'string',
  },
};
function setOptionsByDefaultAndTitles(
  program: Command,
  options: Record<string, any>,
  optionTitles: Record<string, any>,
): Command {
  const optionList = jsonToList({ delimiter: '.', json: options });
  console.log(`optionList`, optionList);
  const optionTypeList = jsonToList({ delimiter: '.', json: optionTypes });
  optionList.forEach(({ key, value }) => {
    const type = optionTypeList.some((item) => item.key === key);
    console.log(`type`, type, key);
    program.option(`--${key} <${type}>`, optionTitles[key], value);
  });
  return program;
}
const optionTitles = {
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
};
setOptionsByDefaultAndTitles(program, stringDefaultOptions, optionTitles).action(async (options: any) => {
  console.log(`options`, options);
  const jsonOptions = listToJson({
    delimiter: '.',
    list: Object.entries(options).map(([key, value]) => ({ key, value })),
  });
  const typedOptions = OptionHandler.toType(jsonOptions, optionTypes);
  // TODO 暂时不支持function
  delete typedOptions.releaseFileNameOptions.releaseFileNameBuilder;
  const release = new Release(typedOptions);
  await release.start();
});
program.parse(process.argv);
