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
console.log(`result.getCode()`, result.code);
console.log(`result.getString('en')`, result.getString('en'));
