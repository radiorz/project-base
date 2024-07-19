import { getRandom } from '../../timer/lib/utils';
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
export interface Message {
  sessionId: string;
  url: string;
  type: 'Request' | 'Response';
  payload: any;
}
export interface EmitterAdapter {
  onResponse(callback: any): void;
  sendRequest(message: Message): void;
}
export interface Options {
  timeout: number;
  isResponse(data: any): boolean;
  emitter: EmitterAdapter;
}
export const DEFAULT_OPTIONS: Options = {
  timeout: 30_000,
  isResponse: (data: any) => data.type === 'response',
  emitter: {
    onResponse(callback: any) {
      callback();
    },
    sendRequest(message: Message) {},
  },
};
export interface RequestOptions {
  url: string;
  payload: any;
}
export class Requestable {
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
    this.options.emitter.onResponse((data: any) => {
      const { sessionId } = data;
      this.requestWaiters.get(sessionId).resolve(data);
    });
  }
  requestWaiters = new Map<string, any>();
  async request(options: RequestOptions) {
    // 超时逻辑
    const sessionId = getRandom();
    const resultPromise = new Promise((resolve) => {
      this.requestWaiters.set(sessionId, { resolve });
    });
    let { timeout } = this.options;
    let timeoutId;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        this.requestWaiters.delete(sessionId);
        reject(new Error('Request timed out'));
      }, timeout);
    });
    const combinedPromise = Promise.race([resultPromise, timeoutPromise]);
    this.options.emitter.sendRequest({ ...options, sessionId, type: 'Request' });
    const result = await combinedPromise;
    clearTimeout(timeoutId);
    return result;
  }
}
let a = 1;
function getRandom() {
  return '' + Date.now() + a++;
}
