import type { EventName, MessageListener, NodeName } from './types';
import { isValidNodeName } from './path';
import type { ConnectOptions, Eventbus } from './Eventbus';

export interface CreateNodeOptions {
  /**
   * name 节点名称.
   */
  name: NodeName;
  /**
   * priority 节点优先级,数值越大越先被投递.
   * 设计原因: 在存在多条出边时,允许上层用优先级表达更重要的传播路径.
   */
  priority?: number;
}

/**
 * Node 是 Eventbus 上的逻辑节点.
 * 设计原因: 对外暴露面向业务的 join/connect/on/emit API,把路由细节收敛在 Eventbus 内部.
 */
export class Node {
  readonly name: NodeName;
  readonly priority: number;
  private readonly bus: Eventbus;
  parent?: Node;
  readonly children: Set<Node>;

  /**
   * @param bus 事件总线实例.
   * @param options 节点创建选项.
   */
  constructor(bus: Eventbus, options: CreateNodeOptions) {
    if (!isValidNodeName(options.name)) {
      throw new Error(`Invalid node name: ${options.name}`);
    }
    this.bus = bus;
    this.name = options.name;
    this.priority = options.priority ?? 0;
    this.children = new Set();
  }

  /**
   * 让当前节点成为 child 的父节点,并建立父子单向关系的双向投递边.
   * @param child 子节点实例.
   * @param options 连接选项,不包含 kind,kind 会由父子关系强制指定.
   * 设计原因: 父子关系需要明确方向,避免 inferKind 在运行时依赖字符串推断而产生歧义.
   */
  join(child: Node, options?: Omit<ConnectOptions, 'kind'>): this {
    if (child.parent && child.parent !== this) {
      child.parent.children.delete(child);
    }
    child.parent = this;
    this.children.add(child);

    this.bus.connect(this.name, child.name, { ...options, bidirectional: false, kind: 'child' });
    this.bus.connect(child.name, this.name, { ...options, bidirectional: false, kind: 'parent' });
    return this;
  }

  /**
   * 建立与 peer 的连接.
   * @param peer 目标节点实例.
   * @param options 连接选项.
   * 设计原因: 对称连接在很多场景更自然,默认 bidirectional 为 true.
   */
  connect(peer: Node, options?: ConnectOptions): this {
    this.bus.connect(this.name, peer.name, { ...options, kind: options?.kind ?? 'peer' });
    return this;
  }

  /**
   * 断开与 peer 的连接.
   * @param peer 目标节点实例.
   * @param bidirectional 是否双向断开,默认 true.
   */
  disconnect(peer: Node, bidirectional: boolean = true): this {
    this.bus.disconnect(this.name, peer.name, bidirectional);
    return this;
  }

  /**
   * 订阅事件.
   * @param event 事件名称.
   * @param listener 监听器,最后一个参数为 ctx.
   */
  on<Args extends any[]>(event: EventName, listener: MessageListener<Args>): this {
    this.bus.on(this.name, event, listener);
    return this;
  }

  /**
   * 取消订阅事件.
   * @param event 事件名称.
   * @param listener 监听器,不传则移除该事件的所有监听器.
   */
  off<Args extends any[]>(event: EventName, listener?: MessageListener<Args>): this {
    this.bus.off(this.name, event, listener);
    return this;
  }

  /**
   * 订阅一次性事件.
   * @param event 事件名称.
   * @param listener 监听器,触发一次后自动移除.
   */
  once<Args extends any[]>(event: EventName, listener: MessageListener<Args>): this {
    this.bus.once(this.name, event, listener);
    return this;
  }

  /**
   * 从当前节点发射事件.
   * @param event 事件名称.
   * @param args 业务参数列表.
   */
  emit<Args extends any[]>(event: EventName, ...args: Args): void {
    this.bus.emit(this.name, event, ...args);
  }
}
