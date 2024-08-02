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
import { Message, Emitter, MessageType } from './common';
import { getRandom } from '../../timer/lib/utils';
export interface Handler {
  (data: Message): any;
}
export interface ResponsiveOptions {
  id: string;
  emitter: Emitter | null;
  responseTopicBuilder: (data: Message) => string;
  requestTopic: 'request';
  isRequest(data: any): boolean;
}
export const DEFAULT_RESPONSIVE_OPTIONS: ResponsiveOptions = {
  id: getRandom(),
  emitter: null,
  responseTopicBuilder: (data: Message) => 'response',
  requestTopic: 'request',
  isRequest: (data: any) => data.type === MessageType.Request,
};
export interface ResponseOptions {}
export class Responsive {
  options: ResponsiveOptions;
  constructor(options?: Partial<ResponsiveOptions>) {
    this.options = Object.assign(DEFAULT_RESPONSIVE_OPTIONS, options);
  }
  init() {
    if (!this.options.emitter) {
      return;
    }
    // 开启监听
    this.options.emitter.on(this.options.requestTopic, (data: any) => {
      this.onRequest(data);
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
  
  private isToMe(data: Message) {
    return data.to == '*' || data.to === this.options.id;
  }
  // 监听
  private async onRequest(request: Message) {
    // console.log(`onRequest`, request);
    if (!this.options.isRequest(request)) {
      return;
    }
    if (!this.isToMe(request)) {
      return;
    }
    let result = await this.handle(request);
    this.options.emitter!.emit(this.options.responseTopicBuilder(request), this.buildMessage(request, result));
  }
  // 处理request 并返回结果
  private async handle(request: Message) {
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
  // 生成 response message
  private buildMessage(request: Message, result: any) {
    return {
      to: request.from,
      from: this.options.id,
      url: request.url,
      type: MessageType.Response,
      sessionId: request.sessionId,
      payload: result,
    };
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
