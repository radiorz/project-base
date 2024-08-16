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

## 1.0

除了命令行传参 args 的方式 可能有的同志更喜欢 问答式（prompts） 的方式

所以我们提供两种cli类型的构建 你可以通过types 去设置他
