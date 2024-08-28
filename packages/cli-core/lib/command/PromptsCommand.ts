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
import { OptionHandler, TYPES } from '../OptionHandler';
import { AbstractCommand, Action } from './command.interface';
import { program } from 'commander';
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
  init() {
    const defaultOptionList = jsonToList({ delimiter: '.', json: this.options.defaultOptions });
    const flattedOptionType = flatJson({
      delimiter: '.',
      data: this.options.optionTypes,
    });
    const flattedOptionTitle = flatJson({
      delimiter: '.',
      data: this.options.optionTitles,
    });
    this.optionHandler = async () => {
      const result: Record<string, any> = {};
      for (const { key, value: defaultValue } of defaultOptionList) {
        const type = flattedOptionType[key];
        if (!type) {
          continue;
        }
        const title = flattedOptionTitle[key];
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
    const typedResults = OptionHandler.toType(unflattedOptions, this.options.optionTypes);
    action(typedResults);
  }
  async start(action: Action) {
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
