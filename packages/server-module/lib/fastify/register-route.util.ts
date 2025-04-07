/**
 * @function registerRoute
 * @description 函数用于
 * @param
 * @returns
 * @example
 * registerRoute() // ->
 */
import type { FastifyInstance, RouteHandler } from 'fastify';
import { Handler } from '../../../requestable-tcp/lib/Router/Layer';
export interface RouteConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  schema?: any;
  preHandler?: RouteHandler[];
  handler: RouteHandler;
  onSend?: RouteHandler[];
  [key: string]: any; // 直接留有余地...
}
type routeModuleFastify = (app: FastifyInstance) => RouteConfig[];
export function registerRouteModule(route: routeModuleFastify, app: FastifyInstance) {
  const routes = route(app);
  routes.forEach((route) => {
    app.route(route);
  });
  app.log.info('路由加载完毕,{}');
}
