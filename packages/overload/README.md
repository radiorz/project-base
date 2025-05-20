# overload
一种书写override函数较为优雅的方法

## 免责
本库仅用于学习交流，如有雷同，纯属巧合。

## 使用
详见 src
```typescript
import { createOverLoad } from '../lib';
const func = createOverLoad({
  impls: [
    [
      'object',
      'object',
      (a: any, b: any) => {
        return Object.assign({}, a, b);
      },
    ],
  ],
});
func.addImpl('string', 'number', (a: string, b: number) => {
  return a + b;
});
func.addImpl('number', 'string', (a: number, b: string) => {
  return a + parseInt(b);
});
console.log(`func('1', 2);`, func('1', 2));
console.log(`func('1', 2);`, func(1, '2'));
console.log(`func({a:1}, {b:1});`, func({ a: 1 }, { b: 1 }));

```
