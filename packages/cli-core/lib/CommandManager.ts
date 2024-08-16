import { merge } from 'lodash';
import { AbstractCommand, Action, CommandOptions } from './command/command.interface';
import { ArgsCommand } from './command/ArgsCommand';
import { PromptsCommand } from './command/PromptsCommand';

export enum CommandTypes {
  'prompts' = 'prompts',
  'args' = 'args',
}
export interface CommandManagerOptions extends CommandOptions {
  types: CommandTypes[];
}
export class CommandManager {
  static readonly DEFAULT_OPTIONS: CommandManagerOptions = {
    ...AbstractCommand.DEFAULT_CLI_OPTIONS,
    types: [CommandTypes.args],
  };
  options: CommandManagerOptions;
  argsCommand?: ArgsCommand;
  promptsCommand?: PromptsCommand;
  constructor(options: Partial<CommandManagerOptions>) {
    this.options = merge(CommandManager.DEFAULT_OPTIONS, options);
    this.init();
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
