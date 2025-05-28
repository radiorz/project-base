# lock

一个简单的上锁工具，生成秘钥，然后你可以用这个包进行密码校验。

## 使用

```javascript
import { generateKey, isValidPassword } from '../lib';

async function bootstrap() {
  // 生成秘钥
  const result = await generateKey('123456');

  console.log(`result`, result);
  // 校验密码》成功
  console.log(`isValidPassword("123456")`, await isValidPassword('123456', result.secret));
  // 校验密码》失败
  console.log(`isValidPassword("1234567")`, await isValidPassword('1234567', result.secret));
}
bootstrap();
```
