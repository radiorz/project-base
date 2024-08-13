/**
 * @author
 * @file Cli.ts
 * @fileBase Cli
 * @path packages\cli-core\lib\Cli.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
import { flatJson, jsonToList, unflatJson } from '@tikkhun/utils-core';
import { Command, createCommand } from 'commander';
import _ from 'lodash';
import { OptionHandler } from './OptionHandler';
const { get } = _;
export interface CliOptions {
  version: string;
  description: string;
  defaultOptions: Record<string, any>;
  excludeOptions: string[];
  optionTypes: Record<string, any>;
  optionTitles: Record<string, any>;
}
export const DEFAULT_CLI_OPTIONS = {
  version: '',
  description: '',
  defaultOptions: {},
  excludeOptions: [],
  optionTypes: {},
  optionTitles: {},
};

export class Cli {
  options: CliOptions;
  program: Command;
  constructor(options?: Partial<CliOptions>) {
    this.options = Object.assign(DEFAULT_CLI_OPTIONS, options);
    this.program = createCommand();
    this.init();
  }
  private addOptionToCommand() {
    const stringOptions = OptionHandler.toString(this.options.defaultOptions);
    const optionList = jsonToList({ delimiter: '.', json: stringOptions });
    const optionTypeMap = flatJson({ delimiter: '.', data: this.options.optionTypes });
    optionList.forEach(({ key, value }) => {
      if (this.options.excludeOptions.includes(key)) {
        return;
      }
      const type = optionTypeMap[key];
      this.program.option(`--${key} <${type}>`, get(this.options.optionTitles, key), value);
    });
  }
  init() {
    this.program.version(this.options.version);
    this.program.description(this.options.description);
    this.addOptionToCommand();
  }
  start(action: (options: any) => any) {
    this.program
      .action((stringOptions) => {
        const jsonOptions = unflatJson({
          delimiter: '.',
          data: stringOptions,
        });
        const typedOptions = OptionHandler.toType(jsonOptions, this.options.optionTypes);
        action(typedOptions);
      })
      .parse(process.argv);
  }
}
