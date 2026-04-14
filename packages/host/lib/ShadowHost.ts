import { createHostProtocolCodec, type HostProtocol, type HostProtocolCodec, type HostProtocolCodecOptions, type HostProtocolMessage, type HostProtocolRpcType, type HostProtocolSchemas } from '@tikkhun/host-protocol';
import type { TransportAdapter } from './transport';

/**
 * ShadowHostSendMessage ShadowHost 允许发送的消息集合.
 * 设计原因: 限制可发送 type,在编译期阻止不受支持的消息进入 transport 层.
 */
export type ShadowHostSendMessage = Extract<
  HostProtocolMessage,
  { type: 'config.get' | 'config.set' | 'control.invoke' | 'relay' | HostProtocolRpcType }
>;

/**
 * ShadowHostOptions ShadowHost 初始化选项.
 * 设计原因: 显式传入 fromId 与 protocol,避免 ShadowHost 依赖全局单例与隐式状态.
 */
export interface ShadowHostOptions {
  /**
   * hostId 主机标识.
   */
  hostId: string;
  /**
   * fromId 发送端点 id.
   */
  fromId: string;
  /**
   * adapter 传输适配器.
   */
  adapter: TransportAdapter;
  /**
   * protocol topic 与消息协议定义.
   */
  protocol: HostProtocol;
  codec?: HostProtocolCodec;
  schemas?: HostProtocolSchemas;
  codecOptions?: Omit<HostProtocolCodecOptions, 'schemas'>;
}

/**
 * ShadowHost 表示本端视角下的远端主机代理.
 * 设计原因: 把 topic 拼装与消息发送细节封装起来,让上层只关心业务意图.
 */
export class ShadowHost {
  /**
   * hostId 远端主机标识,用于 topic 路由.
   */
  readonly hostId: string;

  /**
   * fromId 本端点 id,用于补齐消息 from 字段.
   */
  private fromId: string;

  /**
   * adapter 传输适配器,负责 publish.
   */
  private adapter: TransportAdapter;

  /**
   * protocol topic 规则与消息协议定义.
   */
  private protocol: HostProtocol;

  private codec: HostProtocolCodec | null;

  /**
   * @param options 初始化选项.
   */
  constructor(options: ShadowHostOptions) {
    this.hostId = options.hostId;
    this.fromId = options.fromId;
    this.adapter = options.adapter;
    this.protocol = options.protocol;
    this.codec = options.codec ?? (options.schemas ? createHostProtocolCodec({ ...options.codecOptions, schemas: options.schemas }) : null);
  }

  /**
   * 发送消息到指定 hostId.
   * @param message 协议消息.
   */
  send(message: ShadowHostSendMessage): void {
    const topic = this.protocol.topic.to(this.hostId, message.type);
    const normalized = { ...message, from: this.fromId, to: this.hostId } satisfies HostProtocolMessage;
    this.adapter.publish(topic, this.codec ? this.codec.encode(normalized) : normalized);
  }

  /**
   * 请求读取配置.
   * @param path 配置路径,点分路径或协议约定格式.
   */
  requestConfigGet(path?: string): void {
    this.send({
      type: 'config.get',
      ts: Date.now(),
      payload: { path },
    });
  }

  /**
   * 请求写入配置.
   * @param path 配置路径.
   * @param value 配置值.
   */
  requestConfigSet(path: string, value: any): void {
    this.send({
      type: 'config.set',
      ts: Date.now(),
      payload: { path, value },
    });
  }

  /**
   * 调用远端能力方法.
   * @param capability 能力名称.
   * @param method 方法名称.
   * @param args 方法参数列表.
   */
  invoke(capability: string, method: string, args: any[] = []): void {
    this.send({
      type: 'control.invoke',
      ts: Date.now(),
      payload: { capability, method, args },
    });
  }

  /**
   * 请求远端主机进行 relay 转发.
   * @param toHostId 目标主机 id.
   * @param topic relay topic.
   * @param payload relay payload.
   */
  relay(toHostId: string, topic: string, payload: any): void {
    this.send({
      type: 'relay',
      ts: Date.now(),
      payload: { to: toHostId, topic, payload, from: this.fromId },
    });
  }
}
