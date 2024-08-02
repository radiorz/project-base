/**
 * @author
 * @file Requestable.ts
 * @fileBase Requestable
 * @path packages\requestable\lib\Requestable.ts
 * @from
 * @desc
 * @todo

 *
 * @done
 * @example
 */
import { Emitter, Message, MessageType } from './common';
import { getRandom } from './utils';
export interface RequestableOptions {
  id: string;
  serverId: string;
  timeout: number;
  isResponse(data: any): boolean;
  emitter: Emitter | null;
  responseTopic: string;
  requestTopicBuilder: (data: Message) => string;
}
export const DEFAULT_REQUESTABLE_OPTIONS: RequestableOptions = {
  id: getRandom(),
  serverId: '*',
  responseTopic: 'response',
  timeout: 30_000,
  isResponse: (data: any) => data.type === MessageType.Response,
  emitter: null,
  requestTopicBuilder: (data: any) => 'request',
};
export interface RequestOptions {
  url: string;
  payload: any;
  timeout?: number;
}
export class Requestable {
  options: RequestableOptions;
  constructor(options?: Partial<RequestableOptions>) {
    this.options = Object.assign(DEFAULT_REQUESTABLE_OPTIONS, options);
  }
  private requestWaiters = new Map<string, any>();
  set emitter(emitter: Emitter) {
    this.options.emitter = emitter;
  }
  init() {
    if (!this.options.emitter) {
      return;
    }
    this.options.emitter.on(this.options.responseTopic, this.onResponse);
  }
  private isToMe(data: Message) {
    return data.to == '*' || data.to === this.options.id;
  }
  private onResponse = (data: Message) => {
    if (!this.options.isResponse(data)) {
      return;
    }
    if (!this.isToMe(data)) {
      return;
    }
    this.requestWaiters.get(data.sessionId).resolve(data);
  };
  async request(options: RequestOptions): Promise<Message | unknown> {
    // console.log(`request`, options);
    if (!this.options.emitter) {
      throw new Error('emitter is not defined');
    }
    const sessionId = getRandom();
    // 等待
    const resultPromise: Promise<Message> = new Promise((resolve) => {
      this.requestWaiters.set(sessionId, { resolve });
    });
    // 超时处理
    let timeout = options.timeout ?? this.options.timeout;
    let timeoutId;
    const timeoutPromise: Promise<Error> = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);
    });
    const combinedPromise = Promise.race([resultPromise, timeoutPromise]);
    // 准备消息
    const data: Message = {
      ...options,
      sessionId,
      type: MessageType.Request,
      from: this.options.id,
      to: this.options.serverId,
    };
    const topic = this.options.requestTopicBuilder(data);
    // 发送消息
    this.options.emitter?.emit(topic, data);
    try {
      const result = await combinedPromise;
      return result;
    } catch (err) {
      throw err;
    } finally {
      // 结尾处理
      this.requestWaiters.delete(sessionId);
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
}
