import { FunctionHandlerSystem } from '../lib';
// 示例用法
// 示例用法
async function exampleUsage() {
  const handlerSystem = new FunctionHandlerSystem();

  // 添加全局中间件
  handlerSystem.use(async (ctx, next) => {
    console.log('Global Middleware: Before next');
    await next();
    console.log('Global Middleware: After next');
  });

  // 添加路由中间件
  handlerSystem.route('/home', async (ctx, next) => {
    console.log('Home Route Middleware: Before next');
    ctx.response = `Welcome to Home: ${ctx.request.pathname}`;
    await next();
    console.log('Home Route Middleware: After next');
  });

  handlerSystem.route('/about', async (ctx, next) => {
    console.log('About Route Middleware: Before next');
    ctx.response = `Welcome to About: ${ctx.request.pathname}`;
    await next();
    console.log('About Route Middleware: After next');
  });

  // 处理不同路径的请求
  const homeResult = await handlerSystem.handle('/home', {});
  console.log('Home Result:', homeResult);

  const aboutResult = await handlerSystem.handle('/about', {});
  console.log('About Result:', aboutResult);

  const notFoundResult = await handlerSystem.handle('/unknown', {});
  console.log('Not Found Result:', notFoundResult);
}


// 运行示例
exampleUsage();
