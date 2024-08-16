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
    this.options = Object.assign({}, DEFAULT_RESPONSIVE_OPTIONS, options);
    this.onMessage = this.onMessage.bind(this);
  }
  start() {
    if (!this.options.emitter) {
      throw new Error('emitter is not found');
    }
    // listen
    // 开启监听
    const type = this.options.protocol.getWatchRequestTopic(this);
    this.options.emitter.on(type, this.onMessage);
  }
  stop() {
    if (!this.options.emitter) {
      throw new Error('emitter is not found');
    }
    const type = this.options.protocol.getWatchRequestTopic(this);
    this.options.emitter.off(type, this.onMessage);
  }
  private routes = new Map<string, Handler>();
  // 添加 route
  addRoute(url: string, handler: Handler) {
    // TODO 或许可以模仿express 的蛇形handle
    this.routes.set(url, handler);
  }
  // 匹配路由
  private matchRoute(path: string) {
    // TODO 这里只是进行了最简单的匹配
    return this.routes.has(path);
  }

  // 监听
  private async onMessage(topic: string, message: RequestMessage) {
    // console.log(`onMessage`, topic,message);
    if (!this.options.protocol.isRequestTopic(topic)) {
      return;
    }
    if (!this.options.protocol.isRequestMessage(message)) {
      return;
    }
    if (!this.options.protocol.isRequestToMe(message, this)) {
      return;
    }
    this.onRequest(message);
  }
  private async onRequest(request: RequestMessage) {
    let result = await this.handleRequest(request);
    this.options.emitter!.emit(
      this.options.protocol.buildResponseTopic(request),
      this.options.protocol.buildResponseMessage({
        self: this,
        request,
        result: result,
      }),
    );
  }
  // 处理request 并返回结果
  private doneHandler(url: string) {
    return {
      status: 404,
      message: 'url is not found',
      url: url,
    };
  }
  private async handleRequest(request: RequestMessage) {
    if (!this.matchRoute(request.url)) {
      return this.doneHandler(request.url);
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
