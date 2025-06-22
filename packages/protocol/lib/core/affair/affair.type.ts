import { Message } from '../message';
export type Tid = number | string;
export const defaultTid: Tid = 0

// workerID?工作ID，用于生成事务id
export interface Affair {
  tid: Tid;
  payload: AffairPayload;
}
export interface AffairPayload {
  status: 'begin' | 'end' | 'progress';
  progress?: number; // 进度 0 - 100
  message?: string; // 消息
  result?: string; // 结果
  error?: string; // 错误
}

export interface AffairMessage extends Message, Affair {
  payload: AffairPayload & Message['payload'];
}
