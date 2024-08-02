/**
 * @author
 * @file RR.ts
 * @fileBase RR
 * @path packages\requestable\lib\RR.ts
 * @from
 * @desc 有时候想要进行双向的请求响应通信
 * @todo
 *
 *
 * @done
 * @example
 */

import { Emitter } from './Emitter';
import { Requestable, RequestableOptions, RequestOptions } from './Requestable';
import { Handler, Responsive, ResponsiveOptions } from './Responsive';

export interface RROptions {
  emitter: Emitter | null;
  requestableOptions?: Partial<RequestableOptions>;
  responsiveOptions?: Partial<ResponsiveOptions>;
}
export class RR {
  requestable: Requestable;
  responsive: Responsive;
  constructor(options?: Partial<RROptions>) {
    this.requestable = new Requestable({ emitter: options?.emitter, ...options?.requestableOptions });
    this.responsive = new Responsive({ emitter: options?.emitter, ...options?.responsiveOptions });
  }
  init() {
    this.responsive.init();
    this.requestable.init();
  }
  async request(options: RequestOptions) {
    return this.requestable.request(options);
  }
  addRoute(url: string, handler: Handler) {
    return this.responsive.addRoute(url, handler);
  }
}
