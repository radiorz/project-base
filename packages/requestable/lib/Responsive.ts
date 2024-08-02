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
    this.options.emitter.on(this.options.requestTopic, (data: any) => {
      this.onRequest(data);
    });
  }
  private routes = new Map<string, Handler>();
  // 添加 route
  addRoute(url: string, handler: Handler) {
    this.routes.set(url, handler);
  }
  // 监听
  private async onRequest(data: Message) {
    // console.log(`onRequest`, data);
    if (!this.options.isRequest(data)) {
      return;
    }
    if (!this.routes.has(data.url)) {
      // 返回错误
      this.options.emitter!.emit(this.options.responseTopicBuilder(data), {
        to: data.from,
        from: this.options.id,
        url: data.url,
        type: MessageType.Response,
        sessionId: data.sessionId,
        payload: {
          status: 404,
          message: 'url is not found',
        },
      });
      return;
    }
    const handler = this.routes.get(data.url);
    const result = await handler!(data.payload);
    this.options.emitter!.emit(this.options.responseTopicBuilder(data), {
      to: data.from,
      from: this.options.id,
      url: data.url,
      type: MessageType.Response,
      sessionId: data.sessionId,
      payload: result,
    });
  }
}
