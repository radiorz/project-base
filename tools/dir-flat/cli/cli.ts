#!/usr/bin/env node
import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { flatDir, DEFAULT_FLAT_DIR_OPTIONS } from '../lib';
import packageJson from '../package.json';
const name = packageJson.name;
const logger = new Logger(name);
logger.log(`欢迎~`);
program
  .description('打包')
  .option('--sourcePath <sourcePath>', '源路径', DEFAULT_FLAT_DIR_OPTIONS.sourcePath)
  .option('--includes <includes>', '包括', DEFAULT_FLAT_DIR_OPTIONS.includes.toString())
  .option('--excludes <excludes>', '不包括', DEFAULT_FLAT_DIR_OPTIONS.excludes.toString())
  .option('--targetPath <targetPath>', '目的地', DEFAULT_FLAT_DIR_OPTIONS.targetPath)

  .action(async (options: Record<string, string>) => {
    const opts = {
      ...options,
      includes: options.includes.split(','),
      excludes: options.excludes.split(','),
    };
    await flatDir(opts);
  });
program.parse(process.argv);
