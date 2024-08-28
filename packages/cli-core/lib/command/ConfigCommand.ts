import { flatJson, jsonToList, unflatJson } from '@tikkhun/utils-core';
import { OptionHandler } from '../OptionHandler';
import { AbstractCommand, Action } from './command.interface';
import { Command, createCommand, program } from 'commander';
import _ from 'lodash';
import { readJson } from 'fs-extra';
import { join } from 'path';
export class ConfigCommand extends AbstractCommand {
  program: Command | undefined;
  init(): void {
    // console.log(`this.options.program`, this.options.program);
    this.program = this.options.program?.command('config') || createCommand();
    this.addOptions();
  }
  private addOptions() {
    this.program?.option('-c --config <string>', '配置文件', join(process.cwd(), 'release.json'));
  }
  private addAction(action: Action) {
    this.program!.action(async ({ config = '' }) => {
      let options;
      if (config.endsWith('.js')) {
        options = await import(config);
      } else if (config.endsWith('.json')) {
        options = await readJson(config);
      }
      if (!options) {
        throw new Error(`配置文件为空，请检查${config}`);
      }
      // 这里传入的是config
      action(options);
    });
  }
  start(action: Action) {
    this.addAction(action);
    if (!this.options.program) {
      this.program!.parse(process.argv);
    }
  }
}
