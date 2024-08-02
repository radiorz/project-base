/**
 * @author
 * @file Responsable.ts
 * @fileBase Responsable
 * @path packages\requestable\lib\Responsable.ts
 * @from
 * @desc
 * @todo
 *
 * * 服务端未区分谁发的
 * @done
 * @example
 */
import { Emitter } from './Emitter';
import { getRandom } from '../../timer/lib/utils';
import { Peer, Protocol, RequestMessage } from './Protocol';
export interface Handler {
  (data: RequestMessage): any;
}
export interface ResponsiveOptions {
  id: string;
  emitter: Emitter | null;
  protocol: Protocol;
}
export const DEFAULT_RESPONSIVE_OPTIONS: ResponsiveOptions = {
  id: getRandom(),
  emitter: null,
  protocol: new Protocol(),
};
export interface ResponseOptions {}
export class Responsive implements Peer {
  get id() {
    return this.options.id;
  }
  options: ResponsiveOptions;
  constructor(options?: Partial<ResponsiveOptions>) {
    this.options = Object.assign(DEFAULT_RESPONSIVE_OPTIONS, options);
  }
  init() {
    if (!this.options.emitter) {
      return;
    }
    // 开启监听
    this.options.emitter.on(this.options.protocol.getWatchRequestTopic(this), (data: any) => {
      this.onMessage(data);
    });
  }
  private routes = new Map<string, Handler>();
  // 添加 route
  addRoute(url: string, handler: Handler) {
    this.routes.set(url, handler);
  }
  // 匹配路由
  private matchRoute(path: string) {
    // TODO 这里只是进行了最简单的匹配
    return this.routes.has(path);
  }

  private isToMe(data: RequestMessage) {
    return data.to == '*' || data.to === this.id;
  }
  // 监听
  private async onMessage(message: RequestMessage) {
    // console.log(`onRequest`, request);
    if (!this.options.protocol.isRequestMessage(message)) {
      return;
    }
    if (!this.isToMe(message)) {
      return;
    }
    this.onRequest(message);
  }
  private async onRequest(request: RequestMessage) {
    let result = await this.handle(request);
    this.options.emitter!.emit(
      this.options.protocol.buildResponseTopic(request),
      this.options.protocol.buildResponseMessage({
        self: this,
        request,
        payload: result,
      }),
    );
  }
  // 处理request 并返回结果
  private async handle(request: RequestMessage) {
    if (!this.matchRoute(request.url)) {
      return {
        status: 404,
        message: 'url is not found',
      };
    } else {
      const handler = this.routes.get(request.url);
      return await handler!(request.payload);
    }
  }
}

// class Result {
//   success(payload) {
//     return;
//   }
//   error(meta, paylaod) {
//     return;
//   }
// }
