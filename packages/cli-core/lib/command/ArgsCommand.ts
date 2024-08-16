import { flatJson, jsonToList, unflatJson } from '@tikkhun/utils-core';
import { OptionHandler } from '../OptionHandler';
import { AbstractCommand, Action } from './command.interface';
import { Command, createCommand } from 'commander';
import _ from 'lodash';
const { get } = _;
export class ArgsCommand extends AbstractCommand {
  program: Command | undefined;
  init(): void {
    this.program = createCommand();
    this.addOptions();
  }
  private addOptions() {
    const stringOptions = OptionHandler.toString(this.options.defaultOptions);
    const optionList = jsonToList({ delimiter: '.', json: stringOptions });
    const optionTypeMap = flatJson({ delimiter: '.', data: this.options.optionTypes });
    optionList.forEach(({ key, value }) => {
      if (this.options.excludeOptions.includes(key)) {
        return;
      }
      const type = optionTypeMap[key];
      this.program!.option(`--${key} <${type}>`, get(this.options.optionTitles, key), value);
    });
  }
  start(action: Action) {
    this.program!.action((stringOptions) => {
      const jsonOptions = unflatJson({
        delimiter: '.',
        data: stringOptions,
      });
      const typedOptions = OptionHandler.toType(jsonOptions, this.options.optionTypes);
      action(typedOptions);
    }).parse(process.argv);
  }
}
