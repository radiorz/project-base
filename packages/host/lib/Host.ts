import type { HostHostTree } from './tree';
import type { HeartbeatPayload } from '@tikkhun/host-protocol';
import { MemoryStorage, type StorageAdapter } from './storage';

export type { HeartbeatPayload };

/**
 * HostCapability Host 可注册的能力定义.
 * 设计原因: 把方法表以字典形式暴露,便于与远程调用的 methodName 做直接映射.
 */
export interface HostCapability {
  /**
   * name 能力名称,用于路由调用.
   */
  name: string;
  /**
   * title 能力展示标题.
   */
  title?: string;
  /**
   * description 能力描述.
   */
  description?: string;
  /**
   * methods 方法表.
   * 设计原因: 用对象字典承载方法,便于动态注册与远程调用映射.
   */
  methods: Record<string, (...args: any[]) => any>;
}

/**
 * HostOptions Host 初始化选项.
 * 设计原因: 把 id,name,storage,config 抽成稳定输入,上层可以用不同 transport 复用 Host.
 */
export interface HostOptions {
  /**
   * id 主机标识.
   */
  id: string;
  /**
   * name 主机名称.
   */
  name?: string;
  /**
   * storage 存储适配器,用于持久化配置等数据.
   */
  storage?: StorageAdapter;
  /**
   * config 初始配置对象.
   */
  config?: Record<string, any>;
}
/**
 * Host 表示一个可被管理端控制的主机实体.
 * 设计原因: 把能力注册,配置读写,心跳生成收敛在一个对象上,便于在不同通信层复用.
 */
export class Host {
  /**
   * id 主机标识,用于协议路由与管理端识别.
   */
  readonly id: string;

  /**
   * name 主机名称,用于展示,可选.
   */
  readonly name?: string;

  /**
   * storage 存储适配器,用于持久化配置等数据.
   */
  private storage: StorageAdapter;

  /**
   * capabilities 能力表,以 name 为 key 做快速路由.
   */
  private capabilities: Map<string, HostCapability>;

  /**
   * config 运行时配置对象,可由 storage 加载并在内存中读写.
   */
  private config: Record<string, any>;

  /**
   * @param options 主机初始化选项.
   */
  constructor(options: HostOptions) {
    this.id = options.id;
    this.name = options.name;
    this.storage = options.storage ?? new MemoryStorage();
    this.capabilities = new Map();
    this.config = options.config ?? {};
  }

  /**
   * 注册能力.
   * @param capability 能力定义.
   * 设计原因: 运行时注册可以按需加载插件能力,避免把所有能力都编译进一个固定树.
   */
  registerCapability(capability: HostCapability): this {
    // name 与 methods 是远程调用必需字段,缺失会导致管理端路由失败.
    if (!capability?.name) throw new Error('capability.name is required');
    if (!capability?.methods) throw new Error('capability.methods is required');
    this.capabilities.set(capability.name, capability);
    return this;
  }

  /**
   * 获取能力定义.
   * @param name 能力名称.
   */
  getCapability(name: string): HostCapability | undefined {
    return this.capabilities.get(name);
  }

  /**
   * 获取设备树信息.
   * 设计原因: 提供标准结构给管理端,用于动态发现能力与方法列表.
   */
  getHostTree(): HostHostTree {
    return {
      id: this.id,
      name: this.name,
      capabilities: Array.from(this.capabilities.values()).map((c) => ({
        name: c.name,
        title: c.title,
        description: c.description,
        methods: Object.keys(c.methods).map((m) => ({ name: m })),
      })),
    };
  }

  /**
   * 从 storage 加载配置.
   * @param key 存储键,默认 config.
   */
  async loadConfig(key: string = 'config'): Promise<Record<string, any>> {
    const stored = await this.storage.get<Record<string, any>>(key);
    // 只在 stored 是对象时覆盖,避免把 null,字符串等异常数据污染运行时配置.
    if (stored && typeof stored === 'object') this.config = stored;
    return this.config;
  }

  /**
   * 保存配置到 storage.
   * @param key 存储键,默认 config.
   */
  async saveConfig(key: string = 'config'): Promise<void> {
    await this.storage.set(key, this.config);
  }

  /**
   * 获取配置.
   * @param path 点分路径,例如 a.b.c,不传则返回整个配置对象.
   */
  getConfig<T = any>(path?: string): T {
    if (!path) return this.config as T;
    return getByPath(this.config, path) as T;
  }

  /**
   * 设置配置.
   * @param path 点分路径,例如 a.b.c.
   * @param value 配置值.
   */
  setConfig(path: string, value: any): void {
    setByPath(this.config, path, value);
  }

  /**
   * 调用能力方法.
   * @param capabilityName 能力名称.
   * @param methodName 方法名称.
   * @param args 方法参数列表.
   * 设计原因: 统一入口便于在上层协议中做鉴权,日志,超时控制等横切能力.
   */
  async invoke(capabilityName: string, methodName: string, ...args: any[]): Promise<any> {
    const capability = this.capabilities.get(capabilityName);
    if (!capability) throw new Error(`Capability not found: ${capabilityName}`);
    const method = capability.methods[methodName];
    if (!method) throw new Error(`Method not found: ${capabilityName}.${methodName}`);
    return await method(...args);
  }

  /**
   * 开启心跳定时回调.
   * @param options 心跳选项.
   * @param options.intervalMs 心跳间隔毫秒数.
   * @param options.onHeartbeat 心跳回调.
   * @param options.getStatus 获取状态快照的函数.
   * @returns stop 函数,用于停止心跳.
   * 设计原因: 返回 stop 让调用方显式控制生命周期,避免隐式全局定时器泄漏.
   */
  startHeartbeat(options: { intervalMs: number; onHeartbeat: (payload: HeartbeatPayload) => void; getStatus?: () => Record<string, any> }) {
    const emit = () =>
      options.onHeartbeat({
        id: this.id,
        ts: Date.now(),
        status: options.getStatus?.(),
      });
    emit();
    const timer = setInterval(emit, options.intervalMs);
    return () => clearInterval(timer);
  }
}

/**
 * 通过点分路径读取对象值.
 * @param obj 目标对象.
 * @param path 点分路径.
 * 设计原因: 简化配置访问,让协议层可以只传字符串路径而不暴露对象引用.
 */
function getByPath(obj: any, path: string): any {
  const parts = path.split('.').filter((p) => p.length > 0);
  let cur = obj;
  for (const p of parts) {
    // 遇到 null 或 undefined 直接返回,避免抛错并让上层自行处理缺省值.
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

/**
 * 通过点分路径写入对象值.
 * @param obj 目标对象.
 * @param path 点分路径.
 * @param value 写入值.
 * 设计原因: 写入时自动补齐中间对象,减少上层调用前的存在性检查.
 */
function setByPath(obj: any, path: string, value: any): void {
  const parts = path.split('.').filter((p) => p.length > 0);
  if (!parts.length) return;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    // 中间层不是对象时强制覆盖为对象,否则后续无法继续向下写入.
    if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}
