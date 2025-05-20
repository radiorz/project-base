# action-manager

简单的管理函数策略的工具。

本质就是一个 map 加上 do这个方法。

## 使用

```javascript
import { createActionMgr } from '../lib';

const actionMgr = createActionMgr();
actionMgr.set('add', (a: number, b: number) => a + b);
actionMgr.set('sub', (a: number, b: number) => a - b);
console.log(actionMgr.do('add', 1, 2)); // 3
console.log(actionMgr.get('add')?.(1, 2)); // 3
console.log(actionMgr.get('sub')?.(1, 2)); // -1
actionMgr.do('add123', 1, 2) // 报错

```
