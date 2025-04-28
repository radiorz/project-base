import { Cli, CommandTypes } from '@tikkhun/cli-core';
import packageJson from '../../package.json';
import { isValidPassword } from '..';
export const defaultOptions = {
  password: '123456',
  secret: '',
};
export const optionTitles = {
  password: '密码',
  secret: '密钥',
};
export const optionTypes = {
  password: 'string',
  secret: 'string',
};
export const cliOptions = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  types: [CommandTypes.args, CommandTypes.prompts],
  defaultOptions,
  optionTitles,
  optionTypes,
  action: async (options: any) => {
    const result = await isValidPassword(options?.password, options?.secret);
    if (result) {
      console.log('密码正确');
    } else {
      console.log('密码错误');
    }
  },
};
export const cli = new Cli(cliOptions);
