#!/usr/bin/env node
import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { Release, DEFAULT_RELEASE_OPTIONS, ReleaseFileNameOptions } from '../lib/Release';
import packageJson from '../package.json';
import { OptionHandler } from '@tikkhun/cli-utils';
import { workspace } from '../../version/lib/utils';
const { name, version } = packageJson;
Logger.log(`[欢迎使用] ${name}`);
const stringDefaultOptions = OptionHandler.toString(DEFAULT_RELEASE_OPTIONS);
program
  .version(version)
  .description('打包')
  .option('--workspace <workspace>', '根路径', stringDefaultOptions.workspace)
  .option('--include <include>', '包含', stringDefaultOptions.include)
  .option('--exclude <exclude>', '不包含', stringDefaultOptions.exclude)
  .option('--releasePath <releasePath>', '打包存放位置', stringDefaultOptions.releasePath)
  .option('--archiveType <archiveType>', '打包格式', stringDefaultOptions.archiveType)

  .option('--projectName <projectName>', '打包名称', stringDefaultOptions.releaseFileNameOptions.projectName)
  .option('--withVersion <withVersion>', '需要版本号', stringDefaultOptions.releaseFileNameOptions.withVersion)
  .option('--withTime <withTime>', '需要打包时间', stringDefaultOptions.releaseFileNameOptions.withTime)
  .option('--timePattern <timePattern>', '版本号样式', stringDefaultOptions.releaseFileNameOptions.timePattern)
  .option('--versionTag <versionTag>', '版本标签', stringDefaultOptions.releaseFileNameOptions.versionTag)
  .option('--environment <environment>', '版本标签', stringDefaultOptions.releaseFileNameOptions.environment)
  .action(async (options: any) => {
    const {
      workspace,
      include,
      exclude,
      archiveType,
      releasePath,
      projectName,
      withVersion,
      withTime,
      timePattern,
      versionTag,
      environment,
    } = OptionHandler.toType(options, {
      workspace: 'string',
      include: 'array',
      exclude: 'array',
      archiveType: 'string',
      releasePath: 'string',
      //
      projectName: 'string',
      withVersion: 'boolean',
      withTime: 'boolean',
      timePattern: 'string',
      versionTag: 'versionTag',
      environment: 'string',
    });
    const release = new Release({
      workspace,
      include,
      exclude,
      archiveType,
      releasePath,
      releaseFileNameOptions: {
        projectName,
        withVersion,
        withTime,
        timePattern,
        versionTag,
        environment,
      },
    });
    await release.start();
  });
program.parse(process.argv);
