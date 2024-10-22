// 刚创建好
export interface OnCreated {
  onCreated(): void;
}
export interface BeforeStart {
  beforeStart(): void;
}
export interface AfterInputGot {
  // 收集了文件
  afterInputGot(archive: any): void;
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
