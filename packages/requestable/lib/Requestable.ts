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
export interface Callback {
  (message: Message): void;
}
export interface Emitter {
  on(topic: string, callback: Callback): void;
  emit(message: Message): void;
}
export interface Options {
  timeout: number;
  isResponse(data: any): boolean;
  emitter: Emitter | null;
  responseTopic: string;
}
export const DEFAULT_OPTIONS: Options = {
  responseTopic: 'response',
  timeout: 30_000,
  isResponse: (data: any) => data.type === 'response',
  emitter: null,
};
export interface RequestOptions {
  url: string;
  payload: any;
  timeout?: number;
}
export class Requestable {
  options: Options;
  constructor(options?: Partial<Options>) {
    this.options = Object.assign(DEFAULT_OPTIONS, options);
    this.options.emitter?.on(this.options.responseTopic, (data: any) => {
      this.requestWaiters.get(data.sessionId).resolve(data);
    });
  }
  requestWaiters = new Map<string, any>();
  set emitter(emitter: Emitter) {
    this.options.emitter = emitter;
  }
  async request(options: RequestOptions) {
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
    this.options.emitter?.emit({ ...options, sessionId, type: 'Request' });
    const result = await combinedPromise;
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  }
}
let a = 1;
export function getRandom() {
  return '' + Date.now() + a++;
}
