import { Message } from '../message';
export type Tid = number | string;
export const noTid: Tid = 0




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
enum Result {
  handler,
  hangup, // 暂停
  restore, // 恢复

  done, // 结束
  error, // 错误
  timeout, // 超时
  cancel, // 被取消
}

export interface AffairMessage extends Message, Affair {
  payload: AffairPayload & Message['payload'];
}
