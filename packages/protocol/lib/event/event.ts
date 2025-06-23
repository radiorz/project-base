import { LocationConfig } from "../config/configs";
import { Description } from "../consts";

export interface EventSchema extends Description {
  /**
   * 编码
   */
  code: string | number;
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
  type?: EventSchema['name'], // 因为有code 就不需要type了
  code: EventSchema['code'],
  level: EventSchema['level'] // 事件也携带schema中定义的level
  /**
   * 数据
   */
  payload: Payload
}
