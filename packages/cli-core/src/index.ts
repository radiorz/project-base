import { Cli, CommandTypes } from '../lib';
const cli = new Cli({
  name: '无敌测试',
  version: '1.1.1',
  description: '我是世界无敌的命令行工具',
  types: [CommandTypes.args, CommandTypes.prompts, CommandTypes.config, CommandTypes.info],
  defaultOptions: {
    n: 1,
    s: '123',
    b: true,
    o: {
      n: 1,
      s: '123',
      b: true,
    },
  },
  excludeOptions: ['o.b'],
  optionTypes: {
    n: 'number',
    s: 'string',
    b: 'boolean',
    o: {
      n: 'number',
      s: 'string',
      b: 'boolean',
    },
  },
  optionTitles: {
    n: 'numbertitle',
    s: 'stringtitle',
    b: 'booleantitle',
    o: {
      n: 'numbertitleooo',
      s: 'stringtitleooo',
      b: 'booleantitleooo',
    },
  },
});
cli.start((option) => {
  console.log(`option`, option);
});
