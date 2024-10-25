import { Cli, CommandTypes } from '@tikkhun/cli-core';
import { Build } from '../lib';
import packageJson from '../package.json';
const cli = new Cli({
  types: [CommandTypes.args, CommandTypes.config, CommandTypes.prompts],
  version: packageJson.version,
  name: packageJson.name,
  description: packageJson.description,
  defaultOptions: Build.defaultOptions,
  excludeOptions: [],
  optionTypes: {
    workspace: 'string',
    outDir: 'string',
    copyOptions: {
      include: 'array',
      exclude: 'array',
    },
    obfuscateOptions: {
      include: 'array',
      exclude: 'array',
    },
  },
  optionTitles: {
    workspace: '项目根目录',
    outDir: '输出文件夹',
    copyOptions: {
      include: '[拷贝]包括(pattern)',
      exclude: '[拷贝]排除(pattern)',
    },
    obfuscateOptions: {
      include: '[混淆]包括(pattern)',
      exclude: '[混淆]排除(pattern)',
    },
  },
});
cli.start(async (option: any) => {
  // console.log(`option!!!!`,option)
  const build = new Build(option);
  await build.start();
});
