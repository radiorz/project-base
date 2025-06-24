import { Description } from "../consts";
// 对动作的定义
export interface ActionSchema extends Description {
  payloadSchema: Record<string, any>;
}

// 真正下发的动作数据
export interface Action<Payload = Record<string, any>> {
  name: string; // 名称
  level: number; // 等级
  timeout?: number; // 超时时间()
  response?: boolean; // 需要响应
  payload?: Payload; // 参数
}





