import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { DateVersion, Options } from './DateVersion';

Logger.log('[欢迎] date-version');

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
program.parse(process.argv);
