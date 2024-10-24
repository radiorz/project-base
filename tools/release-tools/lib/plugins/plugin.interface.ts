import { Archiver } from 'archiver';
import { Release } from '../release';

// 刚创建好
export interface OnCreated {
  onCreated(): void;
}
export interface BeforeInputGot {
  beforeInputGot(release: Release): void;
}
export interface AfterInputGot {
  // 收集了文件
  afterInputGot(release: Release): void;
}
export interface AfterArchiveInit {
  afterArchiveInit(release: Release, archive: Archiver): void;
}
export interface BeforeOutput {
  // 开始存储
  beforeOutput(): void;
}
export interface OnError {
  onError(): void;
}

export interface OnEnd {
  // 存储结束
  onEnd(): void;
}
