import { Description } from "../consts";
// 对动作的定义
export interface ActionSchema extends Description {
  paramSchema: Record<string, any>;
}

// 真正下发的动作数据
export interface Action {
  name: string; // 名称
  level: number; // 等级
  payload?: Record<string, any>; // 参数
}





