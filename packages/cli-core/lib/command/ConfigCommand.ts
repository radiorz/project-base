import { Command, createCommand } from 'commander';
import { readJson, writeJson } from 'fs-extra';
import { join } from 'path';
import { AbstractCommand, Action } from './command.interface';
import { Logger } from '@tikkhun/logger';
export class ConfigCommand extends AbstractCommand {
  static defaultConfigPath = join(process.cwd(), 'release.json');
  program: Command | undefined;
  init(): void {
    // console.log(`this.options.program`, this.options.program);
    this.program = this.options.program?.command('config') || createCommand();
    // 这里要获取默认选项便于处理
    this.program
      ?.command('init')
      .option('-p --path <string>', '配置文件路径', ConfigCommand.defaultConfigPath)
      .action(async (options) => {
        let { path } = options;
        if (!path) {
          path = ConfigCommand.defaultConfigPath;
        }
        Logger.log('[开始] 初始化配置文件： ' + path);
        await writeJson(path, this.options.defaultOptions, { spaces: 2 });
        Logger.log('[完毕] 初始化配置文件： ' + path);
      });
    this.addOptions();
  }
  private addOptions() {
    this.program?.option('-c --config <string>', '配置文件', ConfigCommand.defaultConfigPath);
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
