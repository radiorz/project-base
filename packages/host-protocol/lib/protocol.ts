/**
 * HostProtocolTransactionId 事务 id.
 * 设计原因: 允许 string 或 number,便于对接不同 MQ 或数据库的主键体系.
 */
export type HostProtocolTransactionId = string | number;

/**
 * HostProtocolSequenceId 序列 id.
 * 设计原因: 用于区分同一事务内的多段消息或流式片段.
 */
export type HostProtocolSequenceId = string | number;

/**
 * HostProtocolEndpointId 端点 id.
 * 设计原因: 用统一字段 from,to 表达消息路由,便于网关或中继层转发.
 */
export type HostProtocolEndpointId = string;

/**
 * HostProtocolRpcType RPC 类型集合.
 */
export type HostProtocolRpcType = 'rpc.request' | 'rpc.response';

/**
 * HostProtocolMessageType 消息类型集合.
 * 设计原因: 去中心化场景下不再区分 up,down,所有消息都通过 to 或 broadcast 路由.
 */
export type HostProtocolMessageType =
  | 'register'
  | 'heartbeat'
  | 'config.changed'
  | 'control.invoke'
  | 'control.result'
  | 'config.get'
  | 'config.get.result'
  | 'config.set'
  | 'config.set.result'
  | 'relay'
  | HostProtocolRpcType;

export interface HostProtocolMessageBase {
  /**
   * ts 时间戳毫秒,建议使用 Date.now().
   */
  ts?: number;
  /**
   * timestamp 时间戳别名字段,用于兼容历史系统.
   */
  timestamp?: number;
  /**
   * tid 事务 id,用于请求响应关联.
   */
  tid?: HostProtocolTransactionId;
  /**
   * sid 序列 id,用于拆包或流式场景.
   */
  sid?: HostProtocolSequenceId;
  /**
   * from 来源端点 id.
   */
  from?: HostProtocolEndpointId;
  /**
   * to 目标端点 id.
   */
  to?: HostProtocolEndpointId;
}

/**
 * HostRegisterUpMessage 设备注册上行消息.
 */
export interface HostRegisterMessage extends HostProtocolMessageBase {
  type: 'register';
  payload: {
    /**
     * id 主机 id.
     */
    id: string;
    /**
     * name 主机名称.
     */
    name?: string;
    /**
     * tree 能力树或设备树,结构由上层约定.
     */
    tree?: any;
  };
}

/**
 * HostHeartbeatUpMessage 设备心跳上行消息.
 */
export interface HostHeartbeatMessage extends HostProtocolMessageBase {
  type: 'heartbeat';
  payload: {
    id: string;
    status?: Record<string, any>;
  };
}

export type HostHeartbeatPayload = HostHeartbeatMessage['payload'];

export interface HeartbeatPayload {
  id: string;
  ts: number;
  status?: Record<string, any>;
}

/**
 * HostConfigChangedUpMessage 配置变化上行消息.
 */
export interface HostConfigChangedMessage extends HostProtocolMessageBase {
  type: 'config.changed';
  payload: {
    path?: string;
    value: any;
  };
}

/**
 * HostControlResultUpMessage 控制调用结果上行消息.
 */
export interface HostControlResultMessage extends HostProtocolMessageBase {
  type: 'control.result';
  payload: {
    capability: string;
    method: string;
    ok: boolean;
    result?: any;
    error?: string;
  };
}

/**
 * HostConfigGetResultUpMessage 读取配置结果上行消息.
 */
export interface HostConfigGetResultMessage extends HostProtocolMessageBase {
  type: 'config.get.result';
  payload: {
    path?: string;
    ok: boolean;
    value?: any;
    error?: string;
  };
}

/**
 * HostConfigSetResultUpMessage 写入配置结果上行消息.
 */
export interface HostConfigSetResultMessage extends HostProtocolMessageBase {
  type: 'config.set.result';
  payload: {
    path: string;
    ok: boolean;
    error?: string;
  };
}

/**
 * HostRelayUpMessage relay 上行消息.
 * 设计原因: 允许设备作为中继,把其他端点的 topic,payload 转发到管理端或其他设备.
 */
export interface HostRelayMessage extends HostProtocolMessageBase {
  type: 'relay';
  payload: {
    to: string;
    topic: string;
    payload: any;
    from?: string;
  };
}

/**
 * HostRpcRequestMessage RPC 请求消息.
 */
export interface HostRpcRequestMessage extends HostProtocolMessageBase {
  type: 'rpc.request';
  payload: {
    name: string;
    params?: any;
  };
}

/**
 * HostRpcResponseMessage RPC 响应消息.
 */
export interface HostRpcResponseMessage extends HostProtocolMessageBase {
  type: 'rpc.response';
  payload: {
    name: string;
    ok: boolean;
    result?: any;
    error?: string;
  };
}

export type HostProtocolRpcMessage = HostRpcRequestMessage | HostRpcResponseMessage;

/**
 * HostConfigGetMessage 读取配置消息.
 */
export interface HostConfigGetMessage extends HostProtocolMessageBase {
  type: 'config.get';
  payload: {
    path?: string;
  };
}

/**
 * HostConfigSetMessage 写入配置消息.
 */
export interface HostConfigSetMessage extends HostProtocolMessageBase {
  type: 'config.set';
  payload: {
    path: string;
    value: any;
  };
}

/**
 * HostControlInvokeMessage 控制调用消息.
 */
export interface HostControlInvokeMessage extends HostProtocolMessageBase {
  type: 'control.invoke';
  payload: {
    capability: string;
    method: string;
    args: any[];
  };
}

export type HostProtocolMessage =
  | HostRegisterMessage
  | HostHeartbeatMessage
  | HostConfigChangedMessage
  | HostControlInvokeMessage
  | HostControlResultMessage
  | HostConfigGetMessage
  | HostConfigGetResultMessage
  | HostConfigSetMessage
  | HostConfigSetResultMessage
  | HostRelayMessage
  | HostProtocolRpcMessage;

export interface HostProtocolTopic {
  /**
   * 生成发往指定端点的 topic.
   * @param to 目标端点 id.
   * @param type 消息类型.
   */
  to(to: string, type: HostProtocolMessageType): string;
  /**
   * 生成订阅指定端点全部入站消息的 topic.
   * @param to 目标端点 id.
   */
  toAll(to: string): string;
  /**
   * 生成 broadcast topic.
   * @param type 消息类型.
   */
  broadcast(type: HostProtocolMessageType): string;
  /**
   * 生成订阅全部 broadcast 消息的 topic.
   */
  broadcastAll(): string;
  /**
   * 从 topic 解析 to.
   * @param topic 实际 topic 字符串.
   * @returns to,解析失败返回 null.
   */
  parseToId(topic: string): string | null;
  /**
   * 从 topic 解析 type.
   * @param topic 实际 topic 字符串.
   * @returns type,解析失败返回 null.
   */
  parseType(topic: string): HostProtocolMessageType | null;
}

export interface HostProtocol {
  /**
   * topic topic 生成与解析工具.
   */
  topic: HostProtocolTopic;
}

export interface HostProtocolOptions {
  /**
   * rootTopic 根 topic,默认 host.
   * 设计原因: 可与多业务共用同一 broker,通过 rootTopic 做命名空间隔离.
   */
  rootTopic: string;
}

/**
 * 创建 host protocol 实例.
 * @param options 协议选项,支持覆盖 rootTopic.
 */
export function createHostProtocol(options?: Partial<HostProtocolOptions>): HostProtocol {
  const opts: HostProtocolOptions = {
    rootTopic: options?.rootTopic ?? 'host',
  };

  const knownTypes: Set<string> = new Set([
    'register',
    'heartbeat',
    'config.changed',
    'control.invoke',
    'control.result',
    'config.get',
    'config.get.result',
    'config.set',
    'config.set.result',
    'relay',
    'rpc.request',
    'rpc.response',
  ]);

  const isMessageType = (value: string): value is HostProtocolMessageType => knownTypes.has(value);

  const topic: HostProtocolTopic = {
    to(to, type) {
      return `${opts.rootTopic}/${to}/${type}`;
    },
    toAll(to) {
      return `${opts.rootTopic}/${to}/#`;
    },
    broadcast(type) {
      return `${opts.rootTopic}/broadcast/${type}`;
    },
    broadcastAll() {
      return `${opts.rootTopic}/broadcast/#`;
    },
    parseToId(t) {
      const parts = t.split('/');
      if (parts.length < 3) return null;
      if (parts[0] !== opts.rootTopic) return null;
      return parts[1] || null;
    },
    parseType(t) {
      const parts = t.split('/');
      if (parts.length < 3) return null;
      if (parts[0] !== opts.rootTopic) return null;
      const type = parts[2];
      if (!type) return null;
      return isMessageType(type) ? type : null;
    },
  };

  return { topic };
}
