import { createInterface } from 'node:readline/promises';
import process from 'node:process';

import { createHostProtocol, type HostProtocol, type HostProtocolMessage } from '@tikkhun/host-protocol';

import { HostNode, ShadowHost, type TransportAdapter, type Unsubscribe } from '../../../lib';

/**
 * Operation 计算操作枚举.
 * 设计原因: 用联合类型替代自由字符串,让控制指令在编译期可约束且便于提示.
 */
type Operation = 'add' | 'sub' | 'mul' | 'div';

/**
 * ControlResult 远控结果消息类型.
 * 设计原因: 用 Extract 从协议消息里提取子类型,避免手写重复结构与漂移.
 */
type ControlResult = Extract<HostProtocolMessage, { type: 'control.result' }>;

/**
 * ConfigGetResult 读配置结果消息类型.
 * 设计原因: 与 ControlResult 一致的提取方式,确保示例与协议定义同步.
 */
type ConfigGetResult = Extract<HostProtocolMessage, { type: 'config.get.result' }>;

/**
 * PendingRequest 管理端等待中的请求状态.
 * 设计原因: 用 sid 做关联键,并在超时后主动 reject,避免 CLI 一直挂起.
 */
type PendingRequest =
  | {
      /**
       * expectedType 期望的返回消息 type.
       */
      expectedType: 'control.result';
      /**
       * resolve Promise resolve 函数.
       */
      resolve: (value: ControlResult) => void;
      /**
       * reject Promise reject 函数.
       */
      reject: (reason?: any) => void;
      /**
       * timeoutId 超时定时器 id.
       */
      timeoutId: ReturnType<typeof setTimeout>;
    }
  | {
      /**
       * expectedType 期望的返回消息 type.
       */
      expectedType: 'config.get.result';
      /**
       * resolve Promise resolve 函数.
       */
      resolve: (value: ConfigGetResult) => void;
      /**
       * reject Promise reject 函数.
       */
      reject: (reason?: any) => void;
      /**
       * timeoutId 超时定时器 id.
       */
      timeoutId: ReturnType<typeof setTimeout>;
    };

/**
 * 创建内存 transport.
 * 设计原因: 示例用进程内 publish/subscribe 模拟 MQ,避免读者额外安装中间件.
 * @returns TransportAdapter 内存版传输适配器.
 */
function createMemoryTransport(): TransportAdapter {
  /**
   * handlers 订阅处理器表.
   * 设计原因: 用 topicPattern 做 key,一组 handler 做 value,便于多个订阅者共享同一模式.
   */
  const handlers = new Map<string, Set<(topic: string, message: any) => void>>();

  /**
   * 匹配 topicPattern 与实际 topic.
   * 设计原因: 仅实现本示例需要的 '/#' 前缀匹配,保持实现最小化.
   * @param pattern 订阅模式.
   * @param topic 实际 topic.
   * @returns 是否匹配.
   */
  const match = (pattern: string, topic: string) => {
    if (pattern.endsWith('/#')) return topic.startsWith(pattern.slice(0, -2));
    return pattern === topic;
  };

  /**
   * subscribe 订阅实现.
   * 设计原因: 返回 unsubscribe,让调用方可以显式释放订阅避免泄漏.
   * @param topicPattern 订阅模式.
   * @param handler 回调函数.
   * @returns Unsubscribe 取消订阅函数.
   */
  const subscribe: TransportAdapter['subscribe'] = (topicPattern, handler): Unsubscribe => {
    const set = handlers.get(topicPattern) ?? new Set();
    set.add(handler);
    handlers.set(topicPattern, set);
    return () => {
      const cur = handlers.get(topicPattern);
      if (!cur) return;
      cur.delete(handler);
      if (cur.size === 0) handlers.delete(topicPattern);
    };
  };

  /**
   * publish 发布实现.
   * 设计原因: 遍历所有订阅模式并同步触发 handler,让示例更易理解与调试.
   * @param topic 实际 topic.
   * @param message 消息体.
   */
  const publish: TransportAdapter['publish'] = (topic, message) => {
    for (const [pattern, set] of handlers) {
      if (!match(pattern, topic)) continue;
      for (const h of set) h(topic, message);
    }
  };

  return { publish, subscribe };
}

/**
 * 创建唯一 id.
 * 设计原因: sid 和 tid 都需要可读且足够唯一,便于调试与日志排查.
 * @param prefix 前缀字符串.
 * @returns id 字符串.
 */
function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * ManagerClient 管理端 CLI 客户端.
 * 设计原因: 该示例只演示 manager 的最小能力,因此不依赖 HostManager,直接用 ShadowHost 发请求并用 sid 等待返回.
 */
class ManagerClient {
  /**
   * protocol 协议工具.
   */
  private readonly protocol: HostProtocol;
  /**
   * managerId 管理端 id.
   */
  private readonly managerId: string;
  /**
   * adapter 传输适配器.
   */
  private readonly adapter: TransportAdapter;
  /**
   * pendingBySid 等待中的请求表.
   * 设计原因: 以 sid 为 key 关联请求和响应,避免依赖 topic 或 from 字段的稳定性.
   */
  private readonly pendingBySid: Map<string, PendingRequest>;
  /**
   * shadows 远端主机代理缓存.
   * 设计原因: 避免重复创建 ShadowHost,并保持 fromId,protocol,adapter 一致.
   */
  private readonly shadows: Map<string, ShadowHost>;
  /**
   * unsubscribe 订阅释放函数.
   */
  private unsubscribe: Unsubscribe | null;

  /**
   * @param options 初始化参数.
   * @param options.protocol 协议工具.
   * @param options.managerId 管理端 id.
   * @param options.adapter 传输适配器.
   */
  constructor(options: { protocol: HostProtocol; managerId: string; adapter: TransportAdapter }) {
    this.protocol = options.protocol;
    this.managerId = options.managerId;
    this.adapter = options.adapter;
    this.pendingBySid = new Map();
    this.shadows = new Map();
    this.unsubscribe = null;
  }

  /**
   * 启动管理端消息监听.
   * 设计原因: 只订阅 managerId 的 inbox,避免收进不相关的 broadcast 噪音.
   */
  start(): void {
    const topicPattern = this.protocol.topic.toAll(this.managerId);
    const unsub = this.adapter.subscribe(topicPattern, (_t, raw) => this.handleIncoming(raw));
    this.unsubscribe = typeof unsub === 'function' ? unsub : null;
  }

  /**
   * 停止管理端消息监听并清理挂起请求.
   * 设计原因: CLI 退出时必须释放定时器与订阅,避免进程无法退出或出现泄漏警告.
   */
  stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    for (const [, pending] of this.pendingBySid) clearTimeout(pending.timeoutId);
    this.pendingBySid.clear();
  }

  /**
   * 处理入站消息.
   * 设计原因: 本示例用 sid 做请求关联,所以只需要关注带 sid 的响应类消息.
   * @param raw 入站原始消息体.
   */
  private handleIncoming(raw: unknown): void {
    const message = raw as HostProtocolMessage;
    if (!message?.type) return;
    const sid = message.sid;
    if (typeof sid !== 'string' || !sid) return;

    const pending = this.pendingBySid.get(sid);
    if (!pending) return;

    if (pending.expectedType !== message.type) return;

    clearTimeout(pending.timeoutId);
    this.pendingBySid.delete(sid);
    (pending as any).resolve(message);
  }

  /**
   * 获取或创建 ShadowHost.
   * 设计原因: ShadowHost 封装了 topic 拼装和 from,to 补齐,使调用点更聚焦业务意图.
   * @param hostId 目标主机 id.
   * @returns ShadowHost 实例.
   */
  private getShadow(hostId: string): ShadowHost {
    const existing = this.shadows.get(hostId);
    if (existing) return existing;
    const shadow = new ShadowHost({
      hostId,
      fromId: this.managerId,
      adapter: this.adapter,
      protocol: this.protocol,
    });
    this.shadows.set(hostId, shadow);
    return shadow;
  }

  /**
   * 发送 control.invoke 并等待 control.result.
   * 设计原因: 用 Promise + timeout 模拟 RPC,便于在 CLI 中以同步写法处理异步消息.
   * @param hostId 目标主机 id.
   * @param operation 运算类型.
   * @param operand 运算操作数.
   * @param timeoutMs 超时毫秒数.
   * @returns 控制结果消息.
   */
  invoke(hostId: string, operation: Operation, operand: number, timeoutMs: number = 1500): Promise<ControlResult> {
    const sid = createId('sid');
    const tid = createId('tid');
    const shadow = this.getShadow(hostId);

    const promise = new Promise<ControlResult>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingBySid.delete(sid);
        reject(new Error(`timeout: ${hostId} control.result`));
      }, timeoutMs);
      this.pendingBySid.set(sid, { expectedType: 'control.result', resolve, reject, timeoutId });
    });

    shadow.send({
      type: 'control.invoke',
      ts: Date.now(),
      sid,
      tid,
      payload: { capability: 'calc', method: operation, args: [operand] },
    });

    return promise;
  }

  /**
   * 发送 config.get 并等待 config.get.result.
   * 设计原因: 与 invoke 统一用 sid 关联,让调用方写法一致且更易扩展到更多消息类型.
   * @param hostId 目标主机 id.
   * @param path 配置路径.
   * @param timeoutMs 超时毫秒数.
   * @returns 读配置结果消息.
   */
  getConfig(hostId: string, path?: string, timeoutMs: number = 1500): Promise<ConfigGetResult> {
    const sid = createId('sid');
    const tid = createId('tid');
    const shadow = this.getShadow(hostId);

    const promise = new Promise<ConfigGetResult>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingBySid.delete(sid);
        reject(new Error(`timeout: ${hostId} config.get.result`));
      }, timeoutMs);
      this.pendingBySid.set(sid, { expectedType: 'config.get.result', resolve, reject, timeoutId });
    });

    shadow.send({
      type: 'config.get',
      ts: Date.now(),
      sid,
      tid,
      payload: { path },
    });

    return promise;
  }
}

/**
 * 解析用户输入的目标主机.
 * 设计原因: 支持 1..N 索引与 all,让 CLI 输入更短,同时保留 q 退出通道.
 * @param input 用户输入字符串.
 * @param hostIds 可选主机列表.
 * @returns 目标 id 列表,返回 null 表示输入非法,返回 [] 表示用户选择退出.
 */
function parseTargetIds(input: string, hostIds: string[]): string[] | null {
  const v = input.trim().toLowerCase();
  if (!v) return null;
  if (v === 'q' || v === 'quit' || v === 'exit') return [];
  if (v === 'all' || v === '*') return hostIds.slice();

  const n = Number(v);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  if (n < 1 || n > hostIds.length) return null;
  return [hostIds[n - 1]];
}

/**
 * 解析用户输入的运算类型.
 * 设计原因: 同时支持符号与单词别名,降低记忆成本并兼容不同键盘输入习惯.
 * @param input 用户输入字符串.
 * @returns Operation 或 null.
 */
function parseOperation(input: string): Operation | null {
  const v = input.trim().toLowerCase();
  if (v === '+' || v === 'add') return 'add';
  if (v === '-' || v === 'sub') return 'sub';
  if (v === '*' || v === 'mul' || v === 'x') return 'mul';
  if (v === '/' || v === 'div') return 'div';
  return null;
}

/**
 * 把未知值格式化为可打印数字.
 * 设计原因: 结果可能来自协议 payload,这里统一兜底为数字展示,避免输出 [object Object].
 * @param value 待格式化的值.
 * @returns 字符串形式.
 */
function formatNumber(value: unknown): string {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 'NaN';
  return String(n);
}

/**
 * 示例主函数.
 * 设计原因: 通过一个 manager 控制多个 slave,演示 host-protocol 的 config.get 与 control.invoke 两条链路.
 * @returns Promise<void>.
 */
async function main(): Promise<void> {
  /**
   * transport 内存 transport.
   */
  const transport = createMemoryTransport();
  /**
   * protocol 协议工具.
   */
  const protocol = createHostProtocol();

  /**
   * slaveIds 分机 id 列表.
   */
  const slaveIds = ['slave-1', 'slave-2', 'slave-3'];
  /**
   * nodes 分机节点列表.
   * 设计原因: 每个分机都是独立 HostNode,共享同一个 transport 以模拟同一消息网络.
   */
  const nodes = slaveIds.map(
    (id) =>
      new HostNode({
        id,
        name: id,
        adapter: transport,
        protocol,
        managerEnabled: false,
        config: { value: 0 },
      }),
  );

  for (const node of nodes) {
    /**
     * 注册 calc 能力.
     * 设计原因: 让 manager 通过 control.invoke 调用 add,sub,mul,div,并把结果写回本机 config.value.
     */
    node.host.registerCapability({
      name: 'calc',
      methods: {
        /**
         * @param n 操作数.
         * @returns 计算结果.
         */
        add: (n: number) => {
          const cur = Number(node.host.getConfig('value') ?? 0);
          const next = cur + Number(n);
          node.host.setConfig('value', next);
          return next;
        },
        /**
         * @param n 操作数.
         * @returns 计算结果.
         */
        sub: (n: number) => {
          const cur = Number(node.host.getConfig('value') ?? 0);
          const next = cur - Number(n);
          node.host.setConfig('value', next);
          return next;
        },
        /**
         * @param n 操作数.
         * @returns 计算结果.
         */
        mul: (n: number) => {
          const cur = Number(node.host.getConfig('value') ?? 0);
          const next = cur * Number(n);
          node.host.setConfig('value', next);
          return next;
        },
        /**
         * @param n 操作数.
         * @returns 计算结果.
         */
        div: (n: number) => {
          const cur = Number(node.host.getConfig('value') ?? 0);
          const d = Number(n);
          if (d === 0) throw new Error('divide by zero');
          const next = cur / d;
          node.host.setConfig('value', next);
          return next;
        },
      },
    });
    node.start();
  }

  /**
   * manager 管理端客户端.
   */
  const manager = new ManagerClient({ protocol, managerId: 'manager-1', adapter: transport });
  manager.start();

  /**
   * 打印所有分机当前 value 状态.
   * 设计原因: 用 config.get 聚合查询作为简单观测面,便于验证控制指令是否生效.
   */
  const printStates = async () => {
    const results = await Promise.allSettled(slaveIds.map((id) => manager.getConfig(id, 'value')));
    const lines = results.map((r, i) => {
      const id = slaveIds[i];
      if (r.status === 'rejected') return `${id}: error(${String((r.reason as any)?.message ?? r.reason)})`;
      const payload = r.value.payload;
      if (!payload.ok) return `${id}: error(${payload.error ?? 'unknown'})`;
      return `${id}: value=${formatNumber(payload.value)}`;
    });
    process.stdout.write(`\nstate: ${lines.join(' | ')}\n\n`);
  };

  await printStates();

  /**
   * rl readline 实例.
   * 设计原因: 用 promises API 让 CLI 输入读取可以用 await 写法.
   */
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write(
    [
      'cli:',
      '- target: 1|2|3|all|q',
      '- op: +|-|*|/ or add|sub|mul|div',
      '- number: any finite number',
      '',
    ].join('\n') + '\n',
  );

  while (true) {
    /**
     * targetRaw 目标输入.
     */
    const targetRaw = await rl.question('target(1|2|3|all|q): ');
    const targets = parseTargetIds(targetRaw, slaveIds);
    if (targets === null) {
      process.stdout.write('invalid target\n');
      continue;
    }
    if (targets.length === 0) break;

    /**
     * opRaw 运算类型输入.
     */
    const opRaw = await rl.question('op(+|-|*|/ or add|sub|mul|div): ');
    const op = parseOperation(opRaw);
    if (!op) {
      process.stdout.write('invalid op\n');
      continue;
    }

    /**
     * numRaw 数字输入.
     */
    const numRaw = await rl.question('number: ');
    /**
     * operand 操作数.
     * 设计原因: 统一在这里做 Number 转换与校验,避免把非法值带入远控链路.
     */
    const operand = Number(numRaw.trim());
    if (!Number.isFinite(operand)) {
      process.stdout.write('invalid number\n');
      continue;
    }

    /**
     * 并发调用多个分机.
     * 设计原因: 在 all 模式下并发更接近真实 manager 广播或批量控制的行为.
     */
    const settled = await Promise.allSettled(targets.map((id) => manager.invoke(id, op, operand)));
    for (const [idx, r] of settled.entries()) {
      const id = targets[idx];
      if (r.status === 'rejected') {
        process.stdout.write(`${id}: error(${String((r.reason as any)?.message ?? r.reason)})\n`);
        continue;
      }
      if (!r.value.payload.ok) {
        process.stdout.write(`${id}: error(${r.value.payload.error ?? 'unknown'})\n`);
        continue;
      }
      process.stdout.write(`${id}: ok(result=${formatNumber(r.value.payload.result)})\n`);
    }

    await printStates();
  }

  rl.close();
  manager.stop();
  for (const node of nodes) node.stop();
}

/**
 * main 入口.
 * 设计原因: 统一兜底输出错误并设置 exitCode,便于脚本在 CI 或子进程场景里被正确识别为失败.
 */
main().catch((e) => {
  process.stderr.write(String(e instanceof Error ? e.stack ?? e.message : e) + '\n');
  process.exitCode = 1;
});
