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
// const actionMap = {
//   [TYPES.array]: input,
//   [TYPES.keyValueArray]: input,
//   [TYPES.number]: number,
//   [TYPES.string]: input,
//   [TYPES.select]: select,
// };
export class PromptsCommand extends AbstractCommand {
  program: any;
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
    this.program = async () => {
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
  }
  private async getActionResult(options: GetActionResultOptions) {
    const { type, ...opts } = options;
    return await input(opts);
  }
  async start(action: Action) {
    const options = await this.program();
    const unflattedOptions = unflatJson({ delimiter: '.', data: options });
    const typedResults = OptionHandler.toType(unflattedOptions, this.options.optionTypes);
    action(typedResults);
  }
}

export interface GetActionResultOptions {
  type: TYPES;
  message: string;
  default: any;
}
