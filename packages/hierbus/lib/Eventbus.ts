import EventBus from '@tikkhun/eventbus';
import type { EventName, MessageContext, MessageListener, NodeName } from './types';
import { isAncestorOf, isValidNodeName } from './path';
import { Node, type CreateNodeOptions } from './Node';

export interface ConnectOptions {
  /**
   * bidirectional 是否自动建立反向边,默认 true.
   * 设计原因: 多数拓扑连接是双向通信,默认开启减少样板代码.
   */
  bidirectional?: boolean;
  /**
   * kind 连接语义,用于在 ctx.kind 中体现投递方向.
   */
  kind?: MessageContext['kind'];
  /**
   * filter 事件过滤器.
   * 设计原因: 允许同一拓扑在不同事件上采用不同传播策略,避免为每个事件单独建图.
   */
  filter?: (event: EventName) => boolean;
}

interface Edge {
  kind: MessageContext['kind'];
  filter?: (event: EventName) => boolean;
}

/**
 * Eventbus 负责维护节点注册,连接拓扑,以及事件在拓扑上的传播.
 * 设计原因: 用一个轻量有向图描述消息路由,避免在业务侧维护复杂的订阅树.
 */
export class Eventbus {
  private bus: EventBus;
  private nodes: Map<NodeName, Node>;
  private edges: Map<NodeName, Map<NodeName, Edge>>;

  /**
   * 初始化内部 eventbus 与拓扑索引.
   */
  constructor() {
    this.bus = new EventBus('.');
    this.nodes = new Map();
    this.edges = new Map();
  }

  /**
   * 创建并注册节点.
   * @param options 节点创建选项.
   */
  createNode(options: CreateNodeOptions): Node {
    const node = new Node(this, options);
    this.register(node);
    return node;
  }

  /**
   * 注册节点到总线.
   * @param node 节点实例.
   * 设计原因: 只有注册过的节点才能参与路由,否则会出现不可控的隐式拓扑.
   */
  register(node: Node): void {
    if (!isValidNodeName(node.name)) {
      throw new Error(`Invalid node name: ${node.name}`);
    }
    this.nodes.set(node.name, node);
    if (!this.edges.has(node.name)) this.edges.set(node.name, new Map());
  }

  /**
   * 获取已注册节点.
   * @param name 节点名称.
   */
  getNode(name: NodeName): Node | undefined {
    return this.nodes.get(name);
  }

  /**
   * 建立 from 到 to 的连接.
   * @param from 起点节点名称.
   * @param to 终点节点名称.
   * @param options 连接选项.
   */
  connect(from: NodeName, to: NodeName, options?: ConnectOptions): void {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error(`Node not registered: ${!this.nodes.has(from) ? from : to}`);
    }

    const bidirectional = options?.bidirectional ?? true;
    this.connectOneWay(from, to, options);
    if (bidirectional) {
      this.connectOneWay(to, from, options);
    }
  }

  /**
   * 建立单向边.
   * @param from 起点节点名称.
   * @param to 终点节点名称.
   * @param options 连接选项.
   */
  private connectOneWay(from: NodeName, to: NodeName, options?: ConnectOptions): void {
    const map = this.edges.get(from) ?? new Map<NodeName, Edge>();
    this.edges.set(from, map);
    map.set(to, {
      kind: options?.kind ?? this.inferKind(from, to),
      filter: options?.filter,
    });
  }

  /**
   * 断开连接.
   * @param from 起点节点名称.
   * @param to 终点节点名称.
   * @param bidirectional 是否同时断开反向边,默认 true.
   */
  disconnect(from: NodeName, to: NodeName, bidirectional: boolean = true): void {
    this.edges.get(from)?.delete(to);
    if (bidirectional) this.edges.get(to)?.delete(from);
  }

  /**
   * 订阅 node 上的 event.
   * @param node 节点名称.
   * @param event 事件名称.
   * @param listener 监听器,最后一个参数为 ctx.
   */
  on<Args extends any[]>(node: NodeName, event: EventName, listener: MessageListener<Args>): void {
    this.bus.on(this.getNodeEventKey(node, event), listener);
  }

  /**
   * 取消订阅 node 上的 event.
   * @param node 节点名称.
   * @param event 事件名称.
   * @param listener 监听器,不传则移除该事件的所有监听器.
   */
  off<Args extends any[]>(node: NodeName, event: EventName, listener?: MessageListener<Args>): void {
    this.bus.off(this.getNodeEventKey(node, event), listener as any);
  }

  /**
   * 订阅一次性事件.
   * @param node 节点名称.
   * @param event 事件名称.
   * @param listener 监听器.
   */
  once<Args extends any[]>(node: NodeName, event: EventName, listener: MessageListener<Args>): void {
    this.bus.once(this.getNodeEventKey(node, event), listener);
  }

  /**
   * 从 source 节点发射事件,并沿拓扑进行广播式传播.
   * @param source 源节点名称.
   * @param event 事件名称.
   * @param args 业务参数列表.
   * 设计原因: 使用 BFS 传播,确保 hop 语义与拓扑距离一致,且 visited 防止环路导致无限传播.
   */
  emit<Args extends any[]>(source: NodeName, event: EventName, ...args: Args): void {
    if (!this.nodes.has(source)) {
      throw new Error(`Node not registered: ${source}`);
    }

    // visited 用于避免图存在环时重复投递,否则会出现无限循环.
    const visited = new Set<NodeName>([source]);
    // queue 使用 BFS,让 hop 表示最短传播跳数,便于诊断与限流.
    const queue: Array<{ name: NodeName; hop: number }> = [{ name: source, hop: 0 }];

    while (queue.length) {
      const current = queue.shift()!;
      const outgoing = this.getOutgoingTargetsSorted(current.name);
      for (const target of outgoing) {
        if (visited.has(target.to)) continue;
        // filter 用于按事件裁剪传播边,避免所有事件都走同一拓扑而造成噪声.
        if (target.edge.filter && !target.edge.filter(event)) continue;

        visited.add(target.to);

        const ctx: MessageContext = {
          event,
          from: current.name,
          to: target.to,
          kind: target.edge.kind,
          hop: current.hop + 1,
        };
        this.bus.emit(this.getNodeEventKey(target.to, event), ...args, ctx);
        queue.push({ name: target.to, hop: current.hop + 1 });
      }
    }
  }

  /**
   * 获取 from 的所有出边,并按目标节点 priority 降序排序.
   * @param from 起点节点名称.
   * 设计原因: priority 让业务可以显式控制投递先后,例如先通知核心节点再通知边缘节点.
   */
  private getOutgoingTargetsSorted(from: NodeName): Array<{ to: NodeName; edge: Edge }> {
    const map = this.edges.get(from);
    if (!map) return [];

    const items: Array<{ to: NodeName; edge: Edge; priority: number }> = [];
    for (const [to, edge] of map.entries()) {
      const priority = this.nodes.get(to)?.priority ?? 0;
      items.push({ to, edge, priority });
    }
    items.sort((a, b) => b.priority - a.priority);
    return items.map(({ to, edge }) => ({ to, edge }));
  }

  /**
   * 推断边的 kind.
   * @param from 起点节点名称.
   * @param to 终点节点名称.
   */
  private inferKind(from: NodeName, to: NodeName): MessageContext['kind'] {
    if (isAncestorOf(from, to)) return 'child';
    if (isAncestorOf(to, from)) return 'parent';
    return 'peer';
  }

  /**
   * 生成内部事件 key.
   * @param node 节点名称.
   * @param event 事件名称.
   * 设计原因: 复用底层 EventBus 的命名空间机制,同时保持 node 与 event 的稳定拼接规则.
   */
  private getNodeEventKey(node: NodeName, event: EventName): string {
    return `${node}.${event}`;
  }
}
