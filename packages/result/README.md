# result

我们大量需要使用result

- 比如日志 我们希望系统性定义他们的code message
- 比如express 返回 我们希望可以返回国际化友好的日志
- 前端的错误提醒等等
  我们目的是实现结果的工程化，也就是可维护性能力要强

一般来说没有工程化的操作就是打印日志等爱写啥写啥，没有规定的话就是爱咋写咋写，十分混乱
本小工具目的就是工程化地、统一地管理我们的结果输出

## 设计

result 输入

- `success` 成功与否
- `token` 业务链条 比如 ['user', 'login'] 借鉴国际化常见操作，用'user.login' 这样表示也可
- `error` 错误体 即代码中捕获的错误
- `payload` 其他的数据可以暂存在这里 因为经常我们知道结果还想知道他相关的一些其他东西，比如上下文
  我们输出主要就是以我们自己语言写的日志，以及有时候更方便的是使用code快速区分和分类结果的类型
  那么我们便约定用json这种轻松的配置，来配置结果与 locale /code 的映射关系
  message 约定了
- success部分是成功的message ，error 是错误的
- 约定了`{}`简单的插值来填充相关的信息
  这样我们可以顺利获取多语言的日志信息，以及结果code

## 使用

使用上的心智负担要求主要就是要工程化的管理咱们的业务模块，以业务区分我们的结果，从而形成独一无二的token（code）

比如后台认证，我们的业务token 可以这样编写

- 用户登录验证码校验 user.sign_in.verify_captcha
- 用户登录获取token user.sign_in.get_token
- 用户登录刷新token user.sign_in.refresh_token
- 用户退出 user.sign_out
  之类的
然后分别写我们的message
message 的心智负担主要是要想好插值，当错误的时候要联系上下文和错误信息

## 使用示例

如文档未及时更新，详见单侧与 src 示例

```typescript
import { BestResultFactory } from '../lib';
import zh from './zh';
const resultFactory = new BestResultFactory();

const result = resultFactory.createResult({
  success: false, // 成功与否
  token: 'user.login', // 业务链条 比如 ['user', 'login']
  error: new Error('没事抛个错'), // 错误体 即代码中捕获的错误
  payload: {}, // 其他的数据可以暂存在这里
  // 直接的输出者
});
resultFactory.addLocale('zh', zh); // 第一个添加的是默认语言
resultFactory.addLocale('en', {
  error: {
    user: {
      login: 'login failed, reason is {error}',
    },
  },
});
console.log(`result`, result);
console.log(`result.getString() `, result.getString());
console.log(`result.getCode()`, result.getCode());
console.log(`result.getString('en')`, result.getString('en'));

```
