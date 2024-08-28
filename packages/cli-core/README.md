# cli-core

用于创建cli的简便工具

## 使用

```javascript
import { Command } from '../lib';
const cli = new Command({
  version: '1.1.1',
  description: 'hahaha',
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
```

## 不同形式

获取参数的形式有多种形式

- 命令行传参（args）
- 问答式（prompts）
- 配置文件（config）
  你可以通过new Cli的 option 中的types 去决定是否启用这种功能形式
