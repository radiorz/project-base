#!/usr/bin/env node
import { program } from 'commander';
import { Logger } from '@tikkhun/logger';
import { hello } from '../lib';
import packageJson from '../package.json';
const name = packageJson.name;
const logger = new Logger(name);
logger.log(`欢迎~`);
program
  // .description('')
  // .option('--sourcePath <sourcePath>', '源路径', DEFAULT_FLAT_DIR_OPTIONS.sourcePath)
  // .option('--includes <includes>', '包括', DEFAULT_FLAT_DIR_OPTIONS.includes.toString())
  // .option('--excludes <excludes>', '不包括', DEFAULT_FLAT_DIR_OPTIONS.excludes.toString())
  // .option('--targetPath <targetPath>', '目的地', DEFAULT_FLAT_DIR_OPTIONS.targetPath)

  .action(async (options: Record<string, string>) => {
    const opts = {
      ...options,
      includes: options.includes.split(','),
      excludes: options.excludes.split(','),
    };
    // TODO
    hello();
  });
program.parse(process.argv);
