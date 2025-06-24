import { Description } from "../consts";

export interface EventSchema extends Description {
  /**
   * 编码
   */
  code?: string | number; // 实际上code没啥用，code 的好处就是不用对event进行命名
  /**
   * 等级
   */
  level?: number;

  /**
   * 来源，自其他事件派生
   */
  derivedFrom?: string;

  /**
   * 
   */
  payloadSchema?: Record<string, any>
  // message
}

export interface Event<Payload = Record<string, any>> {
  name: EventSchema['name'], // 因为有code 就不需要 name 了
  level: EventSchema['level'] // 事件也携带schema中定义的level
  /**
   * 数据
   */
  payload: Payload
}
export interface BuildEventNameOptions {
  module?: string;
  name: string;
}
export function buildEventName(options: BuildEventNameOptions) {
  return [options.module ?? "default", options.name].join('/')
}