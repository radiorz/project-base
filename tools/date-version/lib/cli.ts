import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { DateVersion, Options } from './DateVersion';
import { Version } from './Version';

Logger.log('[欢迎] version');

program
  .command('update')
  .description('更新JSON')
  .option('-f --format <format>', '日期格式')
  .option('-p --path <filePath>', 'json文件路径')
  .action((options: Options) => {
    const dateVersion = new DateVersion(options);
    dateVersion.update();
  });

program
  .command('get')
  .description('获取版本')
  .option('-f --format <format>', '日期格式')
  .action(({ format }: any) => {
    console.log(`format`, DateVersion.get(format));
    Logger.log(DateVersion.get(format));
  });
// node version
program
  .command('version')
  .description('保存版本')
  .action(() => {
    const version = new Version();
    version.setDotNodeVersion();
    console.log(`保存版本完毕`);
  });
program.parse(process.argv);
