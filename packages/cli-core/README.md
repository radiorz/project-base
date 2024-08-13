# cli-core

用于创建cli的简便工具

## 使用

```javascript
import { Cli } from '../lib';
const cli = new Cli({
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
