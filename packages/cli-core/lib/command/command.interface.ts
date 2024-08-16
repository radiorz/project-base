import _ from 'lodash';
const { merge } = _;
export interface Action {
  (options: any): void;
}
export interface CommandOptions {
  version: string;
  description: string;
  defaultOptions: Record<string, any>;
  excludeOptions: string[];
  optionTypes: Record<string, any>;
  optionTitles: Record<string, any>;
}

export abstract class AbstractCommand {
  static DEFAULT_CLI_OPTIONS: CommandOptions = {
    version: '',
    description: '',
    defaultOptions: {},
    excludeOptions: [],
    optionTypes: {},
    optionTitles: {},
  };

  options: CommandOptions;
  constructor(options?: Partial<CommandOptions>) {
    this.options = merge(AbstractCommand.DEFAULT_CLI_OPTIONS, options);
    this.init();
  }
  abstract init(): void;
  abstract start(action: (options: any) => any): void;
}
