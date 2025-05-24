import { flatNestedObject, nestedObjectToList, unflatNestedObject } from '@tikkhun/utils-core';
import { NestedArgs } from '@tikkhun/nested-args';
import { AbstractCommand, Action } from './command.interface';
import { Command, createCommand, program } from 'commander';
import _ from 'lodash';
const { get } = _;
interface ArgsOption {
  key: string;
  value?: any;
  type?: string;
}
export class ArgsCommand extends AbstractCommand {
  program: Command | undefined;
  getOptions(): ArgsOption[] {
    const stringOptions = NestedArgs.stringify(this.options.defaultOptions);
    const optionList = nestedObjectToList({ delimiter: '.', json: stringOptions });
    // console.log(`optionList`, optionList);
    const optionTypeMap = flatNestedObject({ delimiter: '.', data: this.options.optionTypes });
    return optionList
      .filter(({ key }) => {
        // 排除掉排除的选项
        if (this.options.excludeOptions.includes(key)) {
          return false;
        }
        return true;
      })
      .map(({ key, value }) => {
        return { key, value, type: optionTypeMap[key] };
      });
  }
  init(): void {
    this.program = this.options.program || createCommand();
    const options = this.getOptions();
    this.addOptions(options);
  }
  private addOptions(options: ArgsOption[]) {
    options.forEach(({ key, value, type }) => {
      this.program!.option(`--${key} <${type}>`, get(this.options.optionTitles, key), value);
    });
  }
  private addAction(action: Action) {
    this.program!.action((stringOptions) => {
      // 转换一下传入参数
      const options = unflatNestedObject({
        delimiter: '.',
        data: stringOptions,
      });
      const typedOptions = NestedArgs.parse(options, this.options.optionTypes);
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
