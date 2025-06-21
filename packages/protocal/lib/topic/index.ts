import { MessageType } from "../messageType";
import { MessageType } from '../../../requestable/lib/Protocol';

export interface Topic {
  /**
   * 主题域
   */
  domain: string;
  /**
   * 事务ID
   * 用于关联多个事件与消息
   */
  tid?: string;
  /**
   * 发送给谁
   */
  to: string; // 设备id 或者组织架构的id，组织id与设备id不重复。
  // /**
  //  * 发送给那个组织
  //  */
  // group: string; // toGroup 或区域 这个区域可能单独拎出来会好一些 其实也是to的一种
  /**
   * 消息类型
   */
  type: MessageType;
}


export function buildTopic(topic: Topic): string {
  return [topic.domain, topic.to, topic.type, topic.tid].join('/')
}
export function parseTopic(topic: string): any/* Topic */ {
  const [domain, to, type, tid] = topic.split('/')
  return {
    domain,
    to,
    // MessageType[type],
    type,
    tid,
  }
}
