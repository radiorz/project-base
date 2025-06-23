import { Message } from '../message';
export type Tid = number | string;
export const defaultTid: Tid = 0

// workerID?工作ID，用于生成事务id
export interface Affair<Payload = Record<string, any>> {
  tid: Tid;
  payload: AffairPayload<Payload>;
}
export interface AffairPayload<Payload = Record<string, any>> {
  status: 'begin' | 'end' | 'progress';
  payload?: Payload;
  progress?: number; // 进度 0 - 100
  message?: string; // 消息
  result?: string; // 结果
  error?: string; // 错误
}

export interface AffairMessage extends Message, Affair {
  payload: AffairPayload & Message['payload'];
}
