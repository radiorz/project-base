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
import { jsonToList } from './jsonToList';
import { flatJson, unflatJson } from '@tikkhun/utils-core';
import { AbstractCommand, Action } from './command.interface';
import { input, number, select } from '@inquirer/prompts';
import { OptionHandler, TYPES } from '../OptionHandler';
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
    console.log(`defaultOptionList`, defaultOptionList);
    const defaultOptionList1 = jsonToList({ delimiter: '.', json: this.options.defaultOptions });
    console.log(`defaultOptionList1`, defaultOptionList1);
    const flattedOptionType = flatJson({
      delimiter: '.',
      data: this.options.optionTypes,
    });
    console.log(`flattedOptionType`, this.options.optionTypes, flattedOptionType);
    const flattedOptionTitle = flatJson({
      delimiter: '.',
      data: this.options.optionTitles,
    });
    this.program = async () => {
      const result: Record<string, any> = {};
      for (const { key, value } of defaultOptionList) {
        const type = flattedOptionType[key];
        if (!type) {
          continue;
        }
        const title = flattedOptionTitle[key];
        if (!title) {
          continue;
        }
        result[key] = (await this.getActionResult(type, title)) || value;
      }
      return result;
    };
  }
  private async getActionResult(type: TYPES, message: string) {
    return await input({ message });
  }
  async start(action: Action) {
    const options = await this.program();
    console.log(`options`, options);
    const unflattedOptions = unflatJson({ delimiter: '.', data: options });
    const typedResults = OptionHandler.toType(unflattedOptions, this.options.optionTypes);
    console.log(`unfl`, unflattedOptions);
    action(typedResults);
  }
}
