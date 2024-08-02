import { getRandom } from './utils';

/**
 * @author
 * @file Protocol.ts
 * @fileBase Protocol
 * @path packages\requestable\lib\Protocol.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
export const MessageType = {
  Request: 'Request',
  Response: 'Response',
} as const;
export type MessageType = keyof typeof MessageType;
export interface RequestMessage {
  from: string;
  to: string;
  sessionId: string;
  url: string;
  type: MessageType;
  payload: any;
}
export interface ResponseMessage {
  from: string;
  to: string;
  sessionId: string;
  url: string;
  type: MessageType;
  payload: any;
}
export interface Peer {
  id: string;
}

export interface RequestMessageInput<Peer> {
  self: Peer;
  toPeer?: Peer;
  url: string;
  payload: any;
}
export interface ResponseMessageInput<Peer> {
  self: Peer;
  request: RequestMessage;
  payload: any;
}
const requestTopic = 'request';
const responseTopic = 'response';
export class Protocol {
  getWatchRequestTopic(data: any): string {
    return requestTopic;
  }
  getWatchResponseTopic(data: any): string {
    return responseTopic;
  }
  // requestable 生成 requestTopic
  buildRequestTopic(data: any): string {
    return requestTopic;
  }
  isRequestTopic(topic: string) {
    return topic === requestTopic;
  }
  isRequestMessage(message: RequestMessage) {
    return message.type === MessageType.Request;
  }
  isRequest(topic: string, data: RequestMessage) {
    return this.isRequestTopic(topic) && this.isRequestMessage(data);
  }
  buildResponseTopic(data: any): string {
    return responseTopic;
  }
  isResponseTopic(topic: string) {
    return topic === responseTopic;
  }
  isResponseMessage(message: ResponseMessage) {
    return message.type === MessageType.Response;
  }
  isResponse(topic: string, data: ResponseMessage) {
    return this.isResponseTopic(topic) && this.isResponseMessage(data);
  }
  isRequestToMe(message: RequestMessage, self: Peer) {
    return message.to === '*' || message.to === self.id;
  }
  isResponseToMe(message: ResponseMessage, self: Peer) {
    return message.to === '*' || message.to === self.id;
  }

  getSessionId() {
    return getRandom();
  }

  buildRequestMessage(options: RequestMessageInput<Peer>): RequestMessage {
    return {
      to: options.toPeer?.id || '*',
      from: options.self.id,
      sessionId: this.getSessionId(),
      type: MessageType.Request,
      url: options.url,
      payload: options.payload,
    };
  }
  // 生成 response message
  buildResponseMessage({ request, self, payload }: ResponseMessageInput<Peer>): ResponseMessage {
    return {
      to: request.from,
      from: self.id,
      sessionId: request.sessionId,
      type: MessageType.Response,
      url: request.url,
      payload,
    };
  }
}
