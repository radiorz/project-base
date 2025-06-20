# message

主要定义一个完整的message是什么样的，怎么初始化,怎么压缩等等。

## 定义

见d.ts

## 使用

```javascript
import { minifyMessage, normalizeMessage } from '../lib';
const normalizedMessage = normalizeMessage({
  payload: { a: 1 },
});
console.log(`normalizedMessage`, normalizedMessage);

const minifiedMessage = minifyMessage(normalizedMessage);
console.log(`minifiedMessage`, minifiedMessage);

```
