import { flatJson, jsonToList, unflatJson } from '@tikkhun/utils-core';
import { OptionHandler } from '../OptionHandler';
import { AbstractCommand, Action } from './command.interface';
import { Command, createCommand, program } from 'commander';
import _ from 'lodash';
const { get } = _;
export class ArgsCommand extends AbstractCommand {
  program: Command | undefined;
  init(): void {
    this.program = this.options.program || createCommand();
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
  private addAction(action: Action) {
    this.program!.action((stringOptions) => {
      // 转换一下传入参数
      const jsonOptions = unflatJson({
        delimiter: '.',
        data: stringOptions,
      });
      const typedOptions = OptionHandler.toType(jsonOptions, this.options.optionTypes);
      action(typedOptions);
    });
  }
  start(action: Action) {
    this.addAction(action);
    // 如果传入program 则让外部控制
    if (!this.options.program) {
      this.program!.parse(process.argv);
    }
  }
}
