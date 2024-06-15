import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { Release, DEFAULT_OPTIONS } from './Release';
import packageJson from '../package.json';
const name = packageJson.name;
Logger.log(`[欢迎使用] ${name}`);

program
  .description('获取版本')
  .option('--workspace <workspace>', '根路径', DEFAULT_OPTIONS.workspace)
  .option('--include <include>', '包含', DEFAULT_OPTIONS.include.toString())
  .option('--exclude <exclude>', '不包含', DEFAULT_OPTIONS.exclude.toString())
  .option('--releaseName <releaseName>', '打包名称', DEFAULT_OPTIONS.releaseName)
  .option('--version <version>', '需要版本号', '' + DEFAULT_OPTIONS.version)
  .option('--versionPattern <versionPattern>', '版本号样式', DEFAULT_OPTIONS.versionPattern)
  .option('--archiveType <archiveType>', '打包格式', DEFAULT_OPTIONS.archiveType)
  .action((options: any) => {
    const { include, exclude, version } = options;
    const opts = {
      ...options,
      include: include.split(','),
      exclude: exclude.split(','),
      version: version === 'true',
    };
    const release = new Release(opts);
    release.start();
  });
program.parse(process.argv);
