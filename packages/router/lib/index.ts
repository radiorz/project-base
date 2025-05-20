// 定义上下文接口
interface Context {
  request: {
    pathname: string;
    // 其他请求属性
    [key: string]: any;
  };
  response: any;
}

// 定义中间件类型
type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;

// 定义路由中间件类型
type RouteMiddleware = {
  pathname: string;
  middleware: Middleware;
};

// 定义函数处理系统类
class FunctionHandlerSystem {
  private middlewares: Middleware[] = [];
  private routeMiddlewares: RouteMiddleware[] = [];

  // 添加全局中间件
  use(middleware: Middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  // 添加路由中间件
  route(pathname: string, middleware: Middleware) {
    this.routeMiddlewares.push({ pathname, middleware });
    return this;
  }

  // 处理请求
  async handle(pathname: string, request: any): Promise<any> {
    const mergedRequest = { ...request, pathname };
    const ctx: Context = {
      request: mergedRequest,
      response: null,
    };

    // 筛选出匹配的路由中间件
    const matchedRouteMiddlewares = this.routeMiddlewares.filter((route) => route.pathname === pathname);

    // 组合全局中间件和匹配的路由中间件
    const allMiddlewares = [...this.middlewares, ...matchedRouteMiddlewares.map((route) => route.middleware)];

    const composed = this.compose(allMiddlewares);
    await composed(ctx);

    return ctx.response;
  }

  // 组合中间件
  private compose(middlewares: Middleware[]) {
    return (ctx: Context) => {
      const dispatch = (i: number): Promise<void> => {
        if (i === middlewares.length) return Promise.resolve();
        const middleware = middlewares[i];
        return middleware(ctx, () => dispatch(i + 1));
      };
      return dispatch(0);
    };
  }
}

// 导出函数处理系统类
export { FunctionHandlerSystem };
