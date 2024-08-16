import { merge } from 'lodash';
import { AbstractCommand, Action, CommandOptions } from './command/command.interface';
import { ArgsCommand } from './command/ArgsCommand';
import { PromptsCommand } from './command/PromptsCommand';
import { Logger } from '@tikkhun/logger';
export enum CommandTypes {
  'prompts' = 'prompts',
  'args' = 'args',
}
export interface CommandManagerOptions extends CommandOptions {
  name: string;
  types: CommandTypes[];
}
export class CommandManager {
  static readonly DEFAULT_OPTIONS: CommandManagerOptions = {
    ...AbstractCommand.DEFAULT_CLI_OPTIONS,
    types: [CommandTypes.args],
    name: '',
  };
  logger: Logger;
  options: CommandManagerOptions;
  argsCommand?: ArgsCommand;
  promptsCommand?: PromptsCommand;
  constructor(options: Partial<CommandManagerOptions>) {
    this.options = merge(CommandManager.DEFAULT_OPTIONS, options);
    this.logger = new Logger(this.options.name);
    this.welcome();
    this.init();
  }
  welcome() {
    this.logger.log('Welcome!');
    this.logger.log("version: "+this.options.version);
    this.logger.log("description: ",this.options.description);
  }
  init() {
    const { types, ...options } = this.options;
    if (!types || !types.length) {
      throw new Error('types is undefined');
    }
    if (types.includes(CommandTypes.args)) {
      this.argsCommand = new ArgsCommand(options);
    }
    if (types.includes(CommandTypes.prompts)) {
      this.promptsCommand = new PromptsCommand(options);
    }
  }
  start(action: Action) {
    if (this.argsCommand) {
      this.argsCommand.program!.command('question').action(() => {
        this.promptsCommand?.start(action);
      });
      this.argsCommand.start(action);
    } else {
      this.promptsCommand?.start(action);
    }
  }
}
// alias
export const Cli = CommandManager;
