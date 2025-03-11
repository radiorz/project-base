import { Command } from 'commander';
import _ from 'lodash';
const { merge } = _;
export interface Action {
  (options: any): void;
}
export interface CommandOptions {
  program?: Command;
  version: string;
  description: string;
  logo?: string;
  defaultOptions: Record<string, any>;
  excludeOptions: string[];
  optionTypes: Record<string, any>;
  optionTitles: Record<string, any>;
  action?: Action;
}

export abstract class AbstractCommand {
  static readonly DEFAULT_OPTIONS: CommandOptions = {
    program: undefined,
    version: '',
    description: '',
    logo: undefined,
    defaultOptions: {},
    excludeOptions: [],
    optionTypes: {},
    optionTitles: {},
  };

  options: CommandOptions;
  constructor(options?: Partial<CommandOptions>) {
    // console.log(`options`, options);
    this.options = merge({}, AbstractCommand.DEFAULT_OPTIONS, options);
    this.init();
  }
  abstract init(): void;
  abstract start(action: (options: any) => any): void;
}
