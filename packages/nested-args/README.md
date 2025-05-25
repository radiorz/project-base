# nested-args

最终配置文件是嵌套的对象，而用户输入配置是单层非嵌套的key+字符串类型的值的形式。
parse就是将用户输入的配置转换为嵌套的对象。
stringify就是将嵌套的对象转换为用户输入的配置。（常用于作为默认值）

## 安装

```bash
npm install @tikkhun/nested-args
```

## 使用

```javascript
import { NestedArgs, TYPES } from '@tikkhun/nested-args';

const nestedArgs = new NestedArgs({
  a: {
    b: 'string',
    c: 'number',
    d: 'boolean',
    e: 'array',
    f: 'object',
    g: 'objectArray',
  },
});
```
