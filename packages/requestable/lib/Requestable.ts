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
import { Emitter } from './Emitter';
import { Protocol, Peer, RequestMessage, ResponseMessage, MessageType } from './Protocol';
import { getRandom } from './utils';
export interface RequestableOptions {
  id: string;
  toPeer?: Peer;
  timeout: number;
  emitter: Emitter | null;
  protocol: Protocol;
}
export const DEFAULT_REQUESTABLE_OPTIONS: RequestableOptions = {
  id: getRandom(),
  timeout: 30_000,
  emitter: null,
  protocol: new Protocol(),
};
export interface RequestOptions {
  url: string;
  payload: any;
  timeout?: number;
}
export class Requestable implements Peer {
  get id() {
    return this.options.id;
  }
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
    this.options.emitter.on(this.options.protocol.getWatchResponseTopic(this), this.onMessage.bind(this));
  }
  private onMessage(message: any) {
    // console.log(`message`, message);
    if (!this.options.protocol.isResponseMessage(message)) {
      return;
    }
    if (!this.options.protocol.isResponseToMe(message, this)) {
      return;
    }
    this.onResponse(message);
  }
  private onResponse(response: ResponseMessage) {
    // console.log(`onResponse`, this.requestWaiters);
    this.requestWaiters.get(response.sessionId)?.resolve(response);
  }
  async request(options: RequestOptions): Promise<ResponseMessage | unknown> {
    // console.log(`request`, options);
    if (!this.options.emitter) {
      throw new Error('emitter is not defined');
    }
    // 准备消息
    const requestMessage: RequestMessage = this.options.protocol.buildRequestMessage({
      self: this,
      url: options.url,
      payload: options.payload,
    });
    // 等待结果
    const resultPromise: Promise<ResponseMessage> = new Promise((resolve) => {
      this.requestWaiters.set(requestMessage.sessionId, { resolve });
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
    // topic
    const topic = this.options.protocol.buildRequestTopic({ self: this, requestMessage });
    // 发送消息
    this.options.emitter?.emit(topic, requestMessage);
    // console.log(`topic,requestMessage`, topic, requestMessage);
    try {
      const result = await combinedPromise;
      return result;
    } catch (err) {
      throw err;
    } finally {
      // 结尾处理
      this.requestWaiters.delete(requestMessage.sessionId);
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
}
