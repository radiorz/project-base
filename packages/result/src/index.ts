import { ResultFactoryImpl } from '../lib';
// 初始化
const resultFactory = new ResultFactoryImpl();
resultFactory.addLocale('zh', {
  user: {
    sign_in: {
      success: '登录成功',
      error: '登录错误，原因为 {error}',
    },
  },
}); // 第一个添加的是默认语言
resultFactory.addLocale('en', {
  user: {
    sign_in: {
      success: 'login success',
      error: 'login failed, reason is {error}',
    },
  },
});
// test success
const result = resultFactory.createResult({
  token: 'user.sign_in', // 业务链条 比如 ['user', 'login']
  status: true, // 细分状态
  // error: new Error('没事抛个错'), // 错误体 即代码中捕获的错误
  payload: {}, // 其他的数据可以暂存在这里
  // 直接的输出者
});
console.log(`successResult`, result);
console.log(`successResult.getString() `, result.getString());
console.log(`successResult.getCode()`, result.getCode());

// 多语言测试
console.log(`successResult.getString('en')`, result.getString('en'));

// 测试切换status
result.status = false;
result.error = new Error('test error');
console.log(`errorResult`, result);
console.log(`errorResult status`, result.status);
console.log(`errorResult code`, result.getCode());
console.log(`errorResult`, result.getString());
