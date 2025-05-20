import { Command } from 'commander';
import _ from 'lodash';
const { merge } = _;
export interface Action {
  (options: any): any;
}
interface Schema {
  // TODO 用类似json schema 的方式去弄选项
  default: any;
  title: string;
  type: string;
}
export interface CommandOptions {
  program?: Command;
  version: string;
  description: string;
  logo?: string;
  optionsSchema?: Schema;
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
  abstract start(action?: Action): void;
}
