import { ID } from "./id";
import { MessageType } from "./messageType";

export interface Message {
  /**
   * 消息类型
   */
  type: MessageType;
  /**
   * 消息来源
   */
  from: ID;
  /**
   * 消息目标
   * 广播的话可以搞个*
   */
  to: ID;
  /**
   * 事务ID
   * 用于关联多个事件与消息
   */
  tid: string | number;
  /**
   * 会话ID
   */
  sid: string | number;
  /**
   * 消息时间戳
   * 指发出消息的时间
   */
  timestamp: number;
  /**
   * 消息的数据
   */
  payload?: Record<string, any>
  /**
   * 消息之外一些额外的信息
   */
  meta: MessageMeta;

  auth?: any; // 认证
}

export interface MessageMeta {
  /**
   * 当启用QoS=1时,确保消息可靠到达,接收方如果收到此消息，应马上回得CODE=100的确认消息
   */
  qos: number;
  /**
   * 是否是重复发送
   */
  resend: false; // 重复发送
  /**
   * 是否中转
   * 中转还是直接发送的
   */
  transit: false,
  /**
   * 奇偶校验
   */
  parity: false
  /**
   * 要求对方确认
   */
  receipt: false,

}

export const defaultMessage: Omit<Message, 'type' | 'timestamp'> = {
  tid: 0,
  from: "",
  to: "",
  sid: 0,
  meta: {
    qos: 0,
    resend: false,
    transit: false,
    parity: false,
    receipt: false
  },
}
