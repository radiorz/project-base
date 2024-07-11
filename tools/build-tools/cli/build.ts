#!/usr/bin/env node
import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { Build, DEFAULT_BUILD_OPTIONS } from '../lib';
import packageJson from '../package.json';
const name = packageJson.name;
const logger = new Logger(name);
logger.log(`欢迎~`);
program
  .description('打包')
  .option('--workspace <workspace>', '根路径', DEFAULT_BUILD_OPTIONS.workspace)
  .option('--outDir <outDir>', '压缩路径', DEFAULT_BUILD_OPTIONS.outDir)

  .action(async (options: any) => {
    const {} = options;
    const opts = {
      ...options,
    };
    const build = new Build(opts);
    await build.start();
  });
program.parse(process.argv);
