import { MessageType } from "./messageType";

export interface Message {
  /**
   * 消息类型
   */
  type: MessageType;
  /**
   * 消息来源
   */
  from: string;
  /**
   * 消息目标
   * 广播的话可以搞个*
   */
  to: string;
  /**
   * 事务ID
   * 用于关联多个事件与消息
   */
  tid: string;


  payload: Record<string, any>
}
