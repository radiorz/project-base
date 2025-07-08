import { AbstractCommand, Action, CommandOptions } from './command/command.interface';
import { ArgsCommand } from './command/ArgsCommand';
import { PromptsCommand } from './command/PromptsCommand';
import { Logger } from '@tikkhun/logger';
import { ConfigCommand } from './command/ConfigCommand';
import { Command, createCommand } from 'commander';
import { mergeOptions } from '@tikkhun/utils-core';
import { InfoCommand } from './command/InfoCommand';
export enum CommandTypes {
  'prompts' = 'prompts',
  'args' = 'args',
  'config' = 'config',
  info = 'info',
}
export interface CommandManagerOptions extends CommandOptions {
  name: string;
  types: CommandTypes[];
  immediatelyWelcome: boolean;
}
export class CommandManager {
  static readonly DEFAULT_OPTIONS: CommandManagerOptions = {
    ...AbstractCommand.DEFAULT_OPTIONS,
    name: '',
    types: [CommandTypes.args, CommandTypes.info],
    immediatelyWelcome: false,
  };
  logger: Logger;
  options: CommandManagerOptions;
  // argsCommand?: ArgsCommand;
  // promptsCommand?: PromptsCommand;
  // configCommand?: ConfigCommand;
  // infoCommand?: InfoCommand;
  commands: AbstractCommand[] = [];
  constructor(options: Partial<CommandManagerOptions>) {
    this.options = mergeOptions(CommandManager.DEFAULT_OPTIONS, options);
    this.logger = new Logger(this.options.name);
    if (this.options.immediatelyWelcome) this.welcome(); // 有的时候并不想马上触发
    this.init();
  }
  welcome() {
    if (this.options.logo) console.log(this.options.logo);
    this.logger.log('Welcome!');
    this.logger.log('version: ' + this.options.version);
    this.logger.log('description: ' + this.options.description);
  }
  program: Command | undefined;
  init() {
    const { types, ...options } = this.options;
    if (!types || !types.length) {
      throw new Error('types is undefined');
    }
    // 特殊处理
    if (types.length === 1 && types[0] === CommandTypes.prompts) {
      return;
    }
    this.program = createCommand();
    const map = {
      [CommandTypes.args]: ArgsCommand,
      [CommandTypes.config]: ConfigCommand,
      [CommandTypes.prompts]: PromptsCommand,
      [CommandTypes.info]: InfoCommand,
    };
    types.forEach((type) => {
      this.commands.push(new map[type]({ ...options, program: this.program }));
    });
  }
  start(action?: Action) {
    if (!action) {
      action = this.options.action;
    }
    if (!action) {
      throw new Error('action is undefined');
    }
    this.commands.forEach((command) => {
      command.start(action);
    });
    // 当没有的时候就不会parse了
    this.program?.parse(process.argv);
  }
}
// alias
export const Cli = CommandManager;
