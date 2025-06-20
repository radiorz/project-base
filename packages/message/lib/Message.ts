import { mergeOptions } from '@tikkhun/utils-core';
import { isEqual } from 'lodash';
import { deepDiff } from './deepDiff';

export interface Message {
  /**
   * 
   */
  type: number;
  from: string;
  to: string;
  timestamp: number;
  sid: number;
  tid: number;
  token: string;
  flags: any;
  payload: Record<string, any>;
}

export const defaultFlags = {
  qos: 0,
  reply: false,
  direct: false,
  serialize: 0,
  parity: 0,
  receipt: false,
  sync: false,
};

export const defaultMessage: Omit<Message, "timestamp"> = {
  type: 0,
  from: '',
  to: '',
  // timestamp: Date.now(), // 这个东西是动态的故不能搞个默认的给他
  sid: 0,
  tid: 0,
  token: '',
  flags: defaultFlags,
  payload: {},
};

export function normalizeMessage(origin: Record<string, any>): Message {
  const message = mergeOptions(defaultMessage, origin);
  return { ...message, timestamp: message.timestamp ?? Date.now() }
}
// 删除一些不必要的参数
export function minifyMessage(message: Message) {
  return deepDiff(defaultMessage, message) as Partial<Message>
}
