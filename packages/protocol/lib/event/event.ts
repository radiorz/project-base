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
  level: number;

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
  type: EventSchema['name'],
  code: EventSchema['code'],
  level: EventSchema['level']
  /**
   * 数据
   */
  payload: Payload
}
