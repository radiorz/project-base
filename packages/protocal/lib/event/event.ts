import { Description } from "../consts";

export interface EventSchema extends Description {
  /**
   * 编码
   */
  code: string | number;

  /**
   * 来源，自其他事件派生
   */
  derivedFrom?: string;

  /**
   * 
   */
  payloadSchema: Record<string, any>
  // message
}

export interface Event {
  type: EventSchema['name'],
  /**
  * 等级
  */
  level: number;
  /**
   * 数据
   */
  payload: Record<string, any>
}
