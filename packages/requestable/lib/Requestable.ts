/**
 * @author
 * @file Requestable.ts
 * @fileBase Requestable
 * @path packages\requestable\lib\Requestable.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
import { Emitter, Message, MessageType } from './common';
import { getRandom } from './utils';
export interface RequestableOptions {
  timeout: number;
  isResponse(data: any): boolean;
  emitter: Emitter | null;
  responseTopic: string;
  requestTopicBuilder: (data: Message) => string;
}
export const DEFAULT_REQUESTABLE_OPTIONS: RequestableOptions = {
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
    this.options.emitter.on(this.options.responseTopic, (data: any) => {
      this.requestWaiters.get(data.sessionId).resolve(data);
    });
  }
  async request(options: RequestOptions) {
    console.log(`request`, options);
    if (!this.options.emitter) {
      throw new Error('emitter is not defined');
    }
    // 超时逻辑
    const sessionId = getRandom();
    const resultPromise = new Promise((resolve) => {
      this.requestWaiters.set(sessionId, { resolve });
    });
    let timeout = options.timeout ?? this.options.timeout;
    let timeoutId;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        this.requestWaiters.delete(sessionId);
        reject(new Error('Request timed out'));
      }, timeout);
    });
    const combinedPromise = Promise.race([resultPromise, timeoutPromise]);
    const data: Message = { ...options, sessionId, type: MessageType.Request };
    const topic = this.options.requestTopicBuilder(data);
    this.options.emitter?.emit(topic, data);
    const result = await combinedPromise;
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  }
}
