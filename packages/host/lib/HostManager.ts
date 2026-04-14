import { Eventbus } from '@tikkhun/hierbus';
import {
  createHostProtocol,
  createHostProtocolCodec,
  type HostProtocol,
  type HostProtocolCodec,
  type HostProtocolCodecOptions,
  type HostProtocolMessage,
  type HostProtocolSchemas,
} from '@tikkhun/host-protocol';
import { ShadowHost } from './ShadowHost';
import type { TransportAdapter, Unsubscribe } from './transport';

/**
 * HostManagerOptions HostManager 初始化选项.
 * 设计原因: 把 transport 与 protocol 作为依赖注入,避免 manager 绑定某一种消息中间件实现.
 */
export interface HostManagerOptions {
  /**
   * id 本端点 id.
   */
  id: string;
  /**
   * adapter 传输适配器.
   */
  adapter: TransportAdapter;
  /**
   * protocol 协议定义,不传则使用默认实现.
   */
  protocol?: HostProtocol;
  codec?: HostProtocolCodec;
  schemas?: HostProtocolSchemas;
  codecOptions?: Omit<HostProtocolCodecOptions, 'schemas'>;
}

/**
 * HostManagerWatchOptions 监听开关.
 * 设计原因: 支持按场景关闭 broadcast 或 inbox,避免重复订阅与不必要的网络开销.
 */
export interface HostManagerWatchOptions {
  /**
   * watchBroadcast 是否监听 broadcast.
   */
  watchBroadcast?: boolean;
  /**
   * watchInbox 是否监听本端 inbox.
   */
  watchInbox?: boolean;
}

/**
 * HostManager 负责发现远端 host,监听入站消息,以及生成 ShadowHost.
 * 设计原因: 去中心化场景下,任何设备都可以开启 manager 能力,以 peer 的方式管理其他设备.
 */
export class HostManager {
  /**
   * id 本端点 id,用于 inbox topic 与 from 字段补齐.
   */
  readonly id: string;

  /**
   * protocol topic 规则与消息协议定义.
   */
  readonly protocol: HostProtocol;

  /**
   * adapter 传输适配器,负责 publish 与 subscribe.
   */
  private adapter: TransportAdapter;

  private codec: HostProtocolCodec | null;

  /**
   * hosts ShadowHost 缓存表,避免重复创建代理对象.
   */
  private hosts: Map<string, ShadowHost>;

  /**
   * unsubscribes 订阅释放函数列表,用于 stop 时集中清理,避免订阅泄漏.
   */
  private unsubscribes: Unsubscribe[];

  /**
   * bus 事件总线,用于把协议消息转为应用事件,便于上层订阅.
   */
  readonly bus: Eventbus;

  /**
   * @param options 初始化选项.
   */
  constructor(options: HostManagerOptions) {
    this.id = options.id;
    this.adapter = options.adapter;
    this.protocol = options.protocol ?? createHostProtocol();
    this.hosts = new Map();
    this.unsubscribes = [];
    this.bus = new Eventbus();
    this.codec = options.codec ?? (options.schemas ? createHostProtocolCodec({ ...options.codecOptions, schemas: options.schemas }) : null);

    const managerNode = this.bus.createNode({ name: 'manager' });
    managerNode.on('host.registered', (payload) => payload);
  }

  /**
   * 开始监听入站消息.
   * @param options 监听选项.
   */
  watch(options?: HostManagerWatchOptions): void {
    const watchBroadcast = options?.watchBroadcast ?? true;
    const watchInbox = options?.watchInbox ?? true;

    if (watchBroadcast) {
      const topic = this.protocol.topic.broadcastAll();
      const unsub = this.adapter.subscribe(topic, (t, message) => this.handleIncoming(t, message));
      if (typeof unsub === 'function') this.unsubscribes.push(unsub);
    }

    if (watchInbox) {
      const topic = this.protocol.topic.toAll(this.id);
      const unsub = this.adapter.subscribe(topic, (t, message) => this.handleIncoming(t, message));
      if (typeof unsub === 'function') this.unsubscribes.push(unsub);
    }
  }

  /**
   * 停止监听并释放订阅.
   */
  stop(): void {
    const fns = this.unsubscribes.slice();
    this.unsubscribes = [];
    for (const fn of fns) fn();
  }

  /**
   * 获取或创建 ShadowHost.
   * @param hostId 主机 id.
   */
  getShadowHost(hostId: string): ShadowHost {
    const existing = this.hosts.get(hostId);
    if (existing) return existing;
    const shadow = new ShadowHost({
      hostId,
      fromId: this.id,
      adapter: this.adapter,
      protocol: this.protocol,
      codec: this.codec ?? undefined,
    });
    this.hosts.set(hostId, shadow);
    return shadow;
  }

  /**
   * 处理入站消息入口.
   * @param topic 实际 topic.
   * @param message 协议消息.
   */
  handleIncoming(topic: string, raw: unknown): void {
    const message = (this.codec?.decode(raw) ?? raw) as HostProtocolMessage;
    if (!message?.type) return;
    if (this.codec && !this.codec.validate(message, 'in')) return;

    if (message.type === 'register') {
      const hostId = message.payload?.id;
      if (typeof hostId === 'string' && hostId) {
        this.getShadowHost(hostId);
        const manager = this.bus.getNode('manager');
        if (manager) manager.emit('host.registered', { hostId, payload: message.payload });
      }
      return;
    }

    if (message.type === 'relay') {
      const to = message.payload?.to;
      if (typeof to === 'string' && to) {
        const shadow = this.getShadowHost(to);
        shadow.send({
          type: 'relay',
          ts: Date.now(),
          payload: {
            to,
            topic: message.payload?.topic ?? '',
            payload: message.payload?.payload,
            from: message.payload?.from ?? message.from,
          },
        });
      }
      return;
    }

    this.forwardAsEvent(message);
  }

  /**
   * 将协议消息转发为事件总线事件.
   * @param message 协议消息.
   * 设计原因: manager 自身不实现业务处理,只负责把消息变成可订阅事件,降低耦合.
   */
  private forwardAsEvent(message: HostProtocolMessage): void {
    const hostId = inferFromId(message);
    if (!hostId) return;

    const manager = this.bus.getNode('manager');
    if (!manager) return;

    const eventName = `host.${message.type}`;
    manager.emit(eventName, { hostId, message });
  }
}

/**
 * 推断消息来源 hostId.
 * @param message 协议消息.
 * 设计原因: 部分消息的 from 可能为空或被中间层替换,因此需要兼容从 payload 回退提取.
 */
function inferFromId(message: HostProtocolMessage): string | null {
  if (typeof message.from === 'string' && message.from) return message.from;
  if (message.type === 'register') return typeof message.payload?.id === 'string' ? message.payload.id : null;
  if (message.type === 'heartbeat') return typeof message.payload?.id === 'string' ? message.payload.id : null;
  return null;
}
