/**
 * 节点名称,建议使用路径形式 a/b/c.
 * 设计原因: 通过字符串前缀关系即可推断父子层级,避免额外的树结构索引.
 */
export type NodeName = string;

/**
 * 事件名称.
 * 设计原因: 统一使用字符串,便于跨进程,跨网络的序列化与调试.
 */
export type EventName = string;

export type DeliveryKind = 'parent' | 'child' | 'peer';

export interface MessageContext {
  /**
   * event 事件名称.
   */
  event: EventName;
  /**
   * from 来源节点名称.
   */
  from: NodeName;
  /**
   * to 目标节点名称.
   */
  to: NodeName;
  /**
   * kind 投递方向,用于区分父子,同级的语义.
   */
  kind: DeliveryKind;
  /**
   * hop 转发跳数.
   * 设计原因: 便于观察消息传播范围,也能作为上层限流或诊断依据.
   */
  hop: number;
}

/**
 * 消息监听器.
 * Args 为业务参数列表,ctx 作为最后一个参数注入,避免破坏原本的业务参数顺序.
 */
export type MessageListener<Args extends any[] = any[]> = (...args: [...Args, MessageContext]) => void;
