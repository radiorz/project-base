export type Tid = number | string;
export const noTid: Tid = 0


export function getRandomTid(): Tid {
  return Math.random().toString(36).substring(2)
}

// workerID?工作ID，用于生成事务id
export interface Affair {
  tid: Tid;
  payload: AffairPayload;
}
export interface AffairPayload {
  progress?: number; // 进度
  message?: string; // 消息
  result?: string; // 结果
}
