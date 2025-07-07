import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../package.json';
import { loadConfig, saveConfig } from '@tikkhun/config-loader';
export const defaultOptions = {
  input: 'package.json',
  output: '',
  // inputOptions: {},
  // outputOptions: {},
};
export const optionTitles = {
  input: '路径',
  output: '输出路径',
  inputOptions: '输入选项',
  outputOptions: '输出选项',
};
export const optionTypes = {
  input: 'string',
  output: 'string',
  inputOptions: 'json',
  outputOptions: 'json',
};
export const cliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  types: [CommandTypes.args, CommandTypes.prompts],
  defaultOptions,
  optionTitles,
  optionTypes,
  action: async (options: { input: string; output: string; inputOptions: any; outputOptions: any }) => {
    const config = await loadConfig(options?.input, options?.inputOptions);
    if (!options.output) {
      console.log(config);
      return;
    }
    await saveConfig(config, options.output, options?.outputOptions);
  },
};
export const cli = new Cli(cliOptions);
