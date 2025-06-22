import { LocationConfig } from "../../config/configs";
import { ID } from "../id";
import { MessageType } from "./messageType";
// 实际上是 MessageWrapper 也就是数据本身可能就是payload部分
export interface Message<Payload = Record<string, any>> {
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
   * 在以下场景需要用到: 
   * - 请求与应答
   * - 进程，比如升级进度
   */
  sid: string | number;
  /**
   * 消息时间戳
   * 指发出消息的时间
   */
  timestamp: number;

  /**
   * 消息具体类型编码
   */
  code: string;
  /**
   * 消息的数据
   */
  payload?: Payload
  /**
   * 消息之外一些额外的信息
   */
  meta?: MessageMeta;
  // 位置 有时候我们需要知道消息设备的位置
  location?: LocationConfig;
  auth?: any; // 认证
}

export interface MessageMeta {
  /**
   * ● 0：不确保消息可靠送达
   * ● 1：确保消息可靠送达（但可能会送达多次）
   * ● 2：确保消息可靠送达（而且只会送达一次） 
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

export const defaultMessage: Omit<Message, 'type' | 'timestamp' | 'code'> = {
  from: "",
  to: "",
  tid: 0,
  sid: 0,
  meta: {
    qos: 0,
    resend: false,
    transit: false,
    parity: false,
    receipt: false
  },
}
