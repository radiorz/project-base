import { MessageType } from "../messageType";

export interface Topic {
  /**
   * 公司
   */
  company: string; // 经常需要搞个公司标志
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
  /**
   * 子类型
   */
  subType?: string; //比如action的子类型熄灯这个类型,配置变更就跟配置完整路径
}


export function buildTopic(topic: Topic): string {
  return [topic.company, topic.domain, topic.tid ?? 0, topic.to, topic.type, topic.subType].join('/')
}
export function parseTopic(topic: string): any/* Topic */ {
  const [company, domain, tid, to, type, subType] = topic.split('/')
  return {
    company,
    domain,
    to,
    // MessageType[type],
    type,
    subType,
    tid,
  }
}
