import { flatNestedObject, mergeOptions, nestedObjectToList, unflatNestedObject } from '@tikkhun/utils-core';
import { NestedArgs } from '@tikkhun/nested-args';
import { AbstractCommand, Action } from './command.interface';
import { Command, createCommand, program } from 'commander';
import _ from 'lodash';
import { loadConfig } from '@tikkhun/config-loader';
const { get } = _;
interface ArgsOption {
  key: string;
  value?: any;
  type?: string;
  title?: string;
}
export class ArgsCommand extends AbstractCommand {
  program: Command | undefined;
  getOptions(): ArgsOption[] {
    const stringOptions = NestedArgs.stringify(this.options.defaultOptions, { schema: this.options.optionTypes });
    const optionList = nestedObjectToList({ delimiter: '.', json: stringOptions });
    // console.log(`optionList`, optionList);
    const optionTypeMap = flatNestedObject({ delimiter: '.', data: this.options.optionTypes });
    return [
      ...optionList
        .filter(({ key }) => {
          // 排除掉排除的选项
          if (this.options.excludeOptions.includes(key)) {
            return false;
          }
          return true;
        })
        .map(({ key, value }) => {
          return { key, value, type: optionTypeMap[key] };
        }),
      // 这里做了个特例
      {
        key: 'config',
        value: '',
        type: 'string',
        title: '配置',
      },
    ];
  }
  init(): void {
    this.program = this.options.program || createCommand();
    const options = this.getOptions();
    this.addOptions(options);
  }
  private addOptions(options: ArgsOption[]) {
    options.forEach(({ key, value, type, title }) => {
      this.program!.option(`--${key} <${type}>`, title || get(this.options.optionTitles, key), value);
    });
  }
  private addAction(action: Action) {
    this.program!.action(async (stringOptions) => {
      // 加了一个尾巴就是文件的config
      const { config: configPath, ...restStringOptions } = stringOptions;
      if (!configPath) {
        const options = await this.getOptionsByArgs(restStringOptions);
        action(options);
        return;
      }
      const options = mergeOptions(await this.getOptionsByFile(configPath), this.getOptionsByArgs(restStringOptions));
      action(options);
    });
  }
  async getOptionsByFile(filePath: string) {
    return await loadConfig(filePath);
  }
  getOptionsByArgs(args: any) {
    // 转换一下传入参数
    const options = unflatNestedObject({
      delimiter: '.',
      data: args,
    });
    const typedOptions = NestedArgs.parse(options, { schema: this.options.optionTypes });
    return typedOptions;
  }
  start(action: Action) {
    this.addAction(action);
    // 如果传入program 则让外部控制
    if (!this.options.program) {
      this.program!.parse(process.argv);
    }
  }
}
