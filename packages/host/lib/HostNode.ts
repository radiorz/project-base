import {
  createHostProtocol,
  createHostProtocolCodec,
  type HostProtocol,
  type HostProtocolCodec,
  type HostProtocolCodecOptions,
  type HostProtocolMessage,
  type HostProtocolSchemas,
} from '@tikkhun/host-protocol';
import { Host, type HostOptions } from './Host';
import { HostManager } from './HostManager';
import type { TransportAdapter, Unsubscribe } from './transport';

/**
 * HostNodeOptions HostNode 初始化选项.
 * 设计原因: 复用 HostOptions 作为通用主机元信息,并额外注入 transport 与 protocol 依赖.
 */
export interface HostNodeOptions extends HostOptions {
  /**
   * adapter 传输适配器.
   */
  adapter: TransportAdapter;
  /**
   * protocol 协议定义,不传则使用默认实现.
   */
  protocol?: HostProtocol;
  /**
   * managerEnabled 是否开启 manager 能力.
   */
  managerEnabled?: boolean;
  codec?: HostProtocolCodec;
  schemas?: HostProtocolSchemas;
  codecOptions?: Omit<HostProtocolCodecOptions, 'schemas'>;
}

/**
 * HostNode 设备节点运行时.
 * 设计原因: 将 Host,Transport,Protocol,Manager 编排到一起,提供 start/stop 生命周期与消息路由入口.
 */
export class HostNode {
  /**
   * host 本地 Host 实例,用于承载能力注册,配置读写,以及设备树生成.
   */
  readonly host: Host;

  /**
   * protocol topic 规则与消息协议定义.
   */
  readonly protocol: HostProtocol;

  /**
   * manager 可选的管理能力,用于发现远端 host 并转发事件.
   */
  readonly manager?: HostManager;

  /**
   * adapter 传输适配器,负责 publish 与 subscribe.
   */
  private adapter: TransportAdapter;

  private codec: HostProtocolCodec | null;

  /**
   * unsubscribes 订阅释放函数列表,用于 stop 时集中清理,避免订阅泄漏.
   */
  private unsubscribes: Unsubscribe[];

  /**
   * @param options 初始化选项.
   */
  constructor(options: HostNodeOptions) {
    this.host = new Host(options);
    this.adapter = options.adapter;
    this.protocol = options.protocol ?? createHostProtocol();
    this.unsubscribes = [];
    this.codec = options.codec ?? (options.schemas ? createHostProtocolCodec({ ...options.codecOptions, schemas: options.schemas }) : null);

    if (options.managerEnabled) {
      this.manager = new HostManager({
        id: this.host.id,
        adapter: this.adapter,
        protocol: this.protocol,
        codec: this.codec ?? undefined,
      });
    }
  }

  /**
   * 启动节点: 订阅 inbox,按需启动 manager,并广播 register.
   */
  start(): void {
    const inboxTopic = this.protocol.topic.toAll(this.host.id);
    const unsub = this.adapter.subscribe(inboxTopic, (t, message) => this.handleIncoming(t, message));
    if (typeof unsub === 'function') this.unsubscribes.push(unsub);

    if (this.manager) this.manager.watch({ watchBroadcast: true, watchInbox: false });

    this.announce();
  }

  /**
   * 停止节点: 取消订阅并停止 manager.
   */
  stop(): void {
    const fns = this.unsubscribes.slice();
    this.unsubscribes = [];
    for (const fn of fns) fn();
    this.manager?.stop();
  }

  /**
   * 广播注册消息.
   */
  announce(): void {
    const topic = this.protocol.topic.broadcast('register');
    const message = {
      type: 'register',
      ts: Date.now(),
      from: this.host.id,
      to: 'broadcast',
      payload: {
        id: this.host.id,
        name: this.host.name,
        tree: this.host.getHostTree(),
      },
    } satisfies HostProtocolMessage;
    this.adapter.publish(topic, this.codec ? this.codec.encode(message) : message);
  }

  /**
   * 处理入站消息.
   * @param topic 实际 topic 字符串.
   * @param message 协议消息.
   * 设计原因: 统一入口便于后续增加鉴权,限流,协议兼容等横切逻辑.
   */
  private handleIncoming(topic: string, raw: unknown): void {
    const message = (this.codec?.decode(raw) ?? raw) as HostProtocolMessage;
    if (!message?.type) return;
    if (this.codec && !this.codec.validate(message, 'in')) return;

    if (this.manager) this.manager.handleIncoming(topic, message);

    const toId = typeof message.to === 'string' && message.to ? message.to : this.protocol.topic.parseToId(topic);
    if (toId !== this.host.id) return;

    if (message.type === 'config.get') {
      this.handleConfigGet(message);
      return;
    }

    if (message.type === 'config.set') {
      this.handleConfigSet(message);
      return;
    }

    if (message.type === 'control.invoke') {
      this.handleControlInvoke(message);
      return;
    }

    if (message.type === 'relay') {
      this.handleRelay(message);
      return;
    }
  }

  /**
   * 向指定端点发布消息.
   * @param to 目标端点 id.
   * @param message 协议消息.
   * 设计原因: 统一补齐 from,to 字段,避免上层遗漏导致路由失败.
   */
  private publishTo(to: string, message: HostProtocolMessage): void {
    const topic = this.protocol.topic.to(to, message.type);
    const normalized = { ...message, from: this.host.id, to } satisfies HostProtocolMessage;
    this.adapter.publish(topic, this.codec ? this.codec.encode(normalized) : normalized);
  }

  /**
   * 处理 config.get 请求.
   * @param message 入站消息.
   */
  private handleConfigGet(message: Extract<HostProtocolMessage, { type: 'config.get' }>): void {
    const replyTo = message.from;
    if (typeof replyTo !== 'string' || !replyTo) return;

    const path = message.payload?.path;
    try {
      const value = this.host.getConfig(path);
      this.publishTo(replyTo, {
        type: 'config.get.result',
        ts: Date.now(),
        tid: message.tid,
        sid: message.sid,
        payload: { path, ok: true, value },
      });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      this.publishTo(replyTo, {
        type: 'config.get.result',
        ts: Date.now(),
        tid: message.tid,
        sid: message.sid,
        payload: { path, ok: false, error },
      });
    }
  }

  /**
   * 处理 config.set 请求.
   * @param message 入站消息.
   */
  private handleConfigSet(message: Extract<HostProtocolMessage, { type: 'config.set' }>): void {
    const replyTo = message.from;
    if (typeof replyTo !== 'string' || !replyTo) return;

    const path = message.payload?.path;
    try {
      if (!path) throw new Error('Missing payload.path');
      this.host.setConfig(path, message.payload?.value);
      this.publishTo(replyTo, {
        type: 'config.set.result',
        ts: Date.now(),
        tid: message.tid,
        sid: message.sid,
        payload: { path, ok: true },
      });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      this.publishTo(replyTo, {
        type: 'config.set.result',
        ts: Date.now(),
        tid: message.tid,
        sid: message.sid,
        payload: { path: path ?? '', ok: false, error },
      });
    }
  }

  /**
   * 处理 control.invoke 请求.
   * @param message 入站消息.
   * 设计原因: 以 Promise 链发送结果,把同步与异步能力方法统一为同一种调用语义.
   */
  private handleControlInvoke(message: Extract<HostProtocolMessage, { type: 'control.invoke' }>): void {
    const replyTo = message.from;
    if (typeof replyTo !== 'string' || !replyTo) return;

    const capability = message.payload?.capability ?? '';
    const method = message.payload?.method ?? '';
    const args = Array.isArray(message.payload?.args) ? message.payload.args : [];

    this.host
      .invoke(capability, method, ...args)
      .then((result) => {
        this.publishTo(replyTo, {
          type: 'control.result',
          ts: Date.now(),
          tid: message.tid,
          sid: message.sid,
          payload: { capability, method, ok: true, result },
        });
      })
      .catch((e) => {
        const error = e instanceof Error ? e.message : String(e);
        this.publishTo(replyTo, {
          type: 'control.result',
          ts: Date.now(),
          tid: message.tid,
          sid: message.sid,
          payload: { capability, method, ok: false, error },
        });
      });
  }

  /**
   * 处理 relay 请求.
   * @param message 入站消息.
   * 设计原因: relay 只负责转发,不解析 payload 业务内容,避免协议层与业务耦合.
   */
  private handleRelay(message: Extract<HostProtocolMessage, { type: 'relay' }>): void {
    const to = message.payload?.to;
    if (typeof to !== 'string' || !to) return;

    const topic = this.protocol.topic.to(to, 'relay');
    const relayMessage = {
      type: 'relay',
      ts: Date.now(),
      from: this.host.id,
      to,
      tid: message.tid,
      sid: message.sid,
      payload: {
        to,
        topic: message.payload?.topic ?? '',
        payload: message.payload?.payload,
        from: message.payload?.from ?? message.from,
      },
    } satisfies HostProtocolMessage;
    this.adapter.publish(topic, this.codec ? this.codec.encode(relayMessage) : relayMessage);
  }
}
