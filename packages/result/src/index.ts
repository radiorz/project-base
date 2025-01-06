import { BestResultFactory } from '../lib';
import code from './code';
import zh from './zh';
const messageMap = new Map();
messageMap.set('zh', zh);
const resultFactory = new BestResultFactory({
  codeJson: code,
  defaultLanguage: 'zh',
  messageMap,
});

const result = resultFactory.createResult({
  success: false, // 成功与否
  bizChain: 'user.login.error', // 业务链条 比如 ['user', 'login']
  error: new Error('message'), // 错误体 即代码中捕获的错误
  payload: {}, // 其他的数据可以暂存在这里
  // 直接的输出者
});

console.log(`result`, result);
console.log(`result.toString() `, result.getFriendlyMessage());
