// import { merge } from 'lodash'; // 这个怎么解决
import _ from 'lodash';
const { merge } = _;
import { AbstractCommand, Action, CommandOptions } from './command/command.interface';
import { ArgsCommand } from './command/ArgsCommand';
import { PromptsCommand } from './command/PromptsCommand';
import { Logger } from '@tikkhun/logger';
import { ConfigCommand } from './command/ConfigCommand';
import { Command, createCommand } from 'commander';
export enum CommandTypes {
  'prompts' = 'prompts',
  'args' = 'args',
  'config' = 'config',
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
    types: [CommandTypes.args],
    immediatelyWelcome: false,
  };
  logger: Logger;
  options: CommandManagerOptions;
  argsCommand?: ArgsCommand;
  promptsCommand?: PromptsCommand;
  configCommand?: ConfigCommand;
  constructor(options: Partial<CommandManagerOptions>) {
    this.options = merge({}, CommandManager.DEFAULT_OPTIONS, options);
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
    if (types.includes(CommandTypes.args)) {
      this.argsCommand = new ArgsCommand({ ...options, program: this.program });
    }
    if (types.includes(CommandTypes.config)) {
      this.configCommand = new ConfigCommand({ ...options, program: this.program });
    }
    if (types.includes(CommandTypes.prompts)) {
      this.promptsCommand = new PromptsCommand({ ...options, program: this.program });
    }
  }
  start(action: Action) {
    this.promptsCommand?.start(action);
    this.configCommand?.start(action);
    this.argsCommand?.start(action);
    // 当没有的时候就不会parse了
    this.program?.parse(process.argv);
  }
}
// alias
export const Cli = CommandManager;
