import { Location } from './location';
import { Affair, AffairPayload } from '../affair';
import { ID } from '../id';
import { MessageType } from './messageType';
import { Description } from '../consts';
export interface MessageSchema extends Description {
  /**
   * 模块
   */
  module?: string; // endpoint config sip mqtt network
  /**
   * 消息类型
   */
  type: MessageType;
  /**
   * 消息子类型
   */
  subType?: string; // 比如事件的子类型 alarm,config,status, 类型, 动作的request response
  /**
   * 等级 一般是紧急程度
   */
  level?: number;
  /**
   * 消息编码
   */
  code?: string;
  /**
   * 消息payload 定义
   */
  payloadSchema?: Record<string, any>;
  // @@unique([module,type,subType,name])
}

// 实际上是 MessageWrapper 也就是数据本身可能就是payload部分
export interface Message<Payload = Record<string, any>>
  extends Pick<MessageSchema, 'module' | 'type' | 'subType' | 'name' | 'code'> {
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
  tid?: Affair['tid'];
  /**
   * 事务payload
   * 如果是事务，可以跟progress,result 这俩
   */
  affair?: AffairPayload;
  /**
   * 会话ID
   * 在以下场景需要用到:
   * - 请求与应答
   * - 进程，比如升级进度
   */
  sid?: string | number;
  /**
   * 创建消息的时间戳
   * 指发出消息的时间
   */
  createdAt: number;
  /**
   * 消息的数据
   */
  payload?: Payload;
  /**
   * 消息之外一些额外的信息
   */
  meta?: Partial<MessageMeta>;
  // 位置 有时候我们需要知道消息设备的位置
  location?: Location;
  /**
   * 认证信息
   * TODO 这个什么时候有用？
   */
  auth?: any;
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
  transit: false;
  /**
   * 存着
   */
  retain: boolean;
  [key: string]: any; // 可以添加任何其他消息之外的数据
}

export const defaultMessage: Omit<Message, 'type' | 'createdAt' | 'name'> = {
  from: '',
  to: '',
  tid: 0,
  sid: 0,
  meta: {
    qos: 0,
    resend: false,
    transit: false,
    parity: false,
    retain: false,
  },
};
export function createMessage<P>(
  messageSchema: MessageSchema,
  message: Omit<Message<P>, 'type' | 'subType' | 'module' | 'name' | 'code'>,
): Message<P> {
  const { type, subType, module, name, code } = messageSchema;
  return {
    ...message,
    type,
    subType,
    module,
    name,
    code,
  };
}
