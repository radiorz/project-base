/**
 * @author
 * @file PromptsCommand.ts
 * @fileBase PromptsCommand
 * @path packages\cli-core\lib\cli\PromptsCommand.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
import { input } from '@inquirer/prompts';
import { flatJson, jsonToList, unflatJson } from '@tikkhun/utils-core';
import { OptionsTransformer, TYPES } from '../options-transformer/options-transformer';
import { AbstractCommand, Action } from './command.interface';
import _ from 'lodash';
const { get } = _;
// const actionMap = {
//   [TYPES.array]: input,
//   [TYPES.keyValueArray]: input,
//   [TYPES.number]: number,
//   [TYPES.string]: input,
//   [TYPES.select]: select,
// };

export class PromptsCommand extends AbstractCommand {
  command: any;
  optionHandler: any;
  getOptions() {
    const stringifyDefaultOptions = OptionsTransformer.stringify(this.options.defaultOptions);
    // 默认选项
    const flattedStringifyDefaultOptionList = jsonToList({
      delimiter: '.',
      json: stringifyDefaultOptions,
    });
    const flattedOptionTypeList = flatJson({
      delimiter: '.',
      data: this.options.optionTypes,
    });
    const flattedOptionTitleList = flatJson({
      delimiter: '.',
      data: this.options.optionTitles,
    });
    return flattedStringifyDefaultOptionList.map(({ key, value }) => {
      return {
        key: key,
        defaultValue: value,
        type: flattedOptionTypeList[key],
        title: flattedOptionTitleList[key],
      };
    });
  }
  init() {
    const options = this.getOptions();
    // console.log(`options`, options);
    // console.log(`options`, options);
    this.optionHandler = async () => {
      const result: Record<string, any> = {};
      for (const { key, defaultValue, type, title } of options) {
        if (!type) {
          continue;
        }
        if (!title) {
          continue;
        }
        result[key] = (await this.getActionResult({ type, message: title, default: defaultValue })) || defaultValue;
      }
      return result;
    };
    // 又有 args 又有 prompts
    if (this.options.program) {
      this.command = this.options.program.command('prompts');
    }
  }
  private async getActionResult(options: GetActionResultOptions) {
    const { type, ...opts } = options;
    return await input(opts);
  }
  private async actionHandler(action: Action) {
    const options = await this.optionHandler();
    const unflattedOptions = unflatJson({ delimiter: '.', data: options });
    const typedResults = OptionsTransformer.parse(unflattedOptions, this.options.optionTypes);
    action(typedResults);
  }
  async start(action: Action | undefined = this.options.action) {
    if (!action) {
      throw new Error('action is undefined');
    }
    if (this.command) {
      this.command.action(() => this.actionHandler(action));
      return;
    }
    this.actionHandler(action);
  }
}

export interface GetActionResultOptions {
  type: TYPES;
  message: string;
  default: any;
}
