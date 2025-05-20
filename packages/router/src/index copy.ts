import { Router } from '../lib';

// 示例用法
async function exampleUsage() {
  const router = new Router();

  // 添加全局中间件
  router.use(async (ctx, next) => {
    console.log('Global Middleware: Before next');
    await next();
    console.log('Global Middleware: After next');
  });

  // 添加局部中间件
  router.use('/home', async (ctx, next) => {
    console.log('Home Local Middleware: Before next');
    await next();
    console.log('Home Local Middleware: After next');
  });

  // 添加路由中间件
  router.route('/home', async (ctx, next) => {
    console.log('Home Route Middleware: Before next');
    ctx.response = `Welcome to Home: ${ctx.request.pathname}`;
    await next();
    console.log('Home Route Middleware: After next');
  });

  router.route('/about', async (ctx, next) => {
    console.log('About Route Middleware: Before next');
    ctx.response = `Welcome to About: ${ctx.request.pathname}`;
    await next();
    console.log('About Route Middleware: After next');
  });

  // 处理不同路径的请求
  const homeResult = await router.handle('/home', {});
  console.log('Home Result:', homeResult);

  const aboutResult = await router.handle('/about', {});
  console.log('About Result:', aboutResult);

  const notFoundResult = await router.handle('/unknown', {});
  console.log('Not Found Result:', notFoundResult);
}

// 运行示例
exampleUsage();
