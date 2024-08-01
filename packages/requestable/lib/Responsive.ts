/**
 * @author
 * @file Responsable.ts
 * @fileBase Responsable
 * @path packages\requestable\lib\Responsable.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
import { Message, Emitter, MessageType } from './common';
export interface Handler {
  (data: Message): any;
}
export interface ResponsiveOptions {
  emitter: Emitter | null;
  responseTopicBuilder: (data: Message) => string;
  requestTopic: 'request';
  isRequest(data: any): boolean;
}
export const DEFAULT_RESPONSIVE_OPTIONS: ResponsiveOptions = {
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
      return;
    }
    const handler = this.routes.get(data.url);
    const result = await handler!(data.payload);
    this.options.emitter!.emit(this.options.responseTopicBuilder(data), {
      url: data.url,
      type: MessageType.Response,
      sessionId: data.sessionId,
      payload: result,
    });
  }
}
