import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import type { TransportAdapter, Unsubscribe } from '@tikkhun/host';

/**
 * MqttAdapterOptions 适配器初始化选项.
 * 设计原因: 将连接信息独立为对象,便于外部以配置文件或环境变量注入.
 */
export interface MqttAdapterOptions extends IClientOptions {
  /**
   * broker MQTT Broker 地址,例如 mqtt://localhost:1883.
   */
  broker: string;
  /**
   * clientId 客户端标识,用于区分连接.
   */
  clientId?: string;
  /**
   * username 用户名.
   */
  username?: string;
  /**
   * password 密码.
   */
  password?: string;
  /**
   * reconnectPeriod 重连周期毫秒.
   */
  reconnectPeriod?: number;
  /**
   * json 是否对消息进行 JSON 序列化与反序列化.
   * 设计原因: host 层默认以对象消息交互,开启后自动做 JSON 编解码.
   */
  json?: boolean;
}

/**
 * MqttTransportAdapter 基于 mqtt.js 的 TransportAdapter 实现.
 * 设计原因: 复用成熟库处理连接管理与 QoS,适配最小 publish 与 subscribe 接口.
 */
export class MqttTransportAdapter implements TransportAdapter {
  /**
   * options 适配器选项.
   */
  private readonly options: Required<Pick<MqttAdapterOptions, 'broker' | 'json'>> & MqttAdapterOptions;
  /**
   * client mqtt 客户端实例.
   */
  private client: MqttClient;
  /**
   * handlers 订阅处理器表,支持同一 topic pattern 多个 handler.
   * key 为订阅的模式字符串,例如 host/+/config.get 或 host/#.
   */
  private handlers: Map<
    string,
    Set<{
      /**
       * handler 订阅回调函数.
       */
      handler: (topic: string, message: any) => void;
    }>
  >;
  /**
   * onMessage 统一的报文回调,用于派发到匹配的订阅处理器.
   */
  private onMessageBound: (topic: string, payload: Buffer) => void;

  /**
   * @param options 初始化选项中文释义: 连接相关配置,包括 broker 地址与是否启用 JSON 编解码.
   */
  constructor(options: MqttAdapterOptions) {
    this.options = { json: true, ...options };
    this.client = mqtt.connect(this.options.broker, {
      clientId: this.options.clientId,
      username: this.options.username,
      password: this.options.password,
      reconnectPeriod: this.options.reconnectPeriod,
      protocolVersion: this.options.protocolVersion,
      clean: this.options.clean,
      keepalive: this.options.keepalive,
      properties: this.options.properties,
    });
    this.handlers = new Map();
    this.onMessageBound = (topic, payload) => this.dispatch(topic, payload);
    this.client.on('message', this.onMessageBound);
  }

  /**
   * publish 发布消息.
   * @param topic 参数中文释义: 发布到的 topic 路由字符串.
   * @param message 参数中文释义: 要发送的消息对象或 Buffer.
   * 设计原因: 默认做 JSON 序列化,跨语言互通; 若已为 Buffer 或字符串,则透传.
   */
  publish(topic: string, message: any): void {
    const body: string | Buffer =
      this.options.json && typeof message !== 'string' && !Buffer.isBuffer(message) ? JSON.stringify(message) : message;
    this.client.publish(topic, body as any);
  }

  /**
   * subscribe 订阅消息.
   * @param topic 参数中文释义: 支持 MQTT 通配符的主题模式.
   * @param handler 参数中文释义: 匹配到消息时的回调函数.
   * @returns Unsubscribe 参数中文释义: 取消订阅的函数.
   * 设计原因: 同一 topic 模式可注册多个 handler,仅在最后一个释放时真正向 broker 取消订阅.
   */
  subscribe(topic: string, handler: (topic: string, message: any) => void): Unsubscribe {
    let set = this.handlers.get(topic);
    const first = !set;
    if (!set) {
      set = new Set();
      this.handlers.set(topic, set);
    }
    const entry = { handler };
    set.add(entry);

    if (first) {
      this.client.subscribe(topic);
    }

    return () => {
      const list = this.handlers.get(topic);
      if (!list) return;
      list.delete(entry);
      if (list.size === 0) {
        this.handlers.delete(topic);
        this.client.unsubscribe(topic);
      }
    };
  }

  /**
   * dispatch 内部派发函数,将原始 mqtt 报文派发至所有匹配的订阅处理器.
   * @param topic 参数中文释义: 实际收到的 topic.
   * @param payload 参数中文释义: 收到的 Buffer 数据.
   * 设计原因: mqtt.js 只提供全局 message 事件,这里根据通配符自行匹配并转为对象.
   */
  private dispatch(topic: string, payload: Buffer): void {
    const text = payload.toString();
    const data = this.options.json ? this.safeParse(text) : text;
    // 遍历所有订阅模式并进行匹配派发
    for (const [pattern, handlers] of this.handlers.entries()) {
      if (matchMqttTopic(pattern, topic)) {
        for (const h of handlers) {
          h.handler(topic, data);
        }
      }
    }
  }

  /**
   * safeParse 安全 JSON 解析.
   * @param text 参数中文释义: 需要解析的字符串.
   * 设计原因: 解析失败时返回原始字符串,避免抛错中断消息分发.
   */
  private safeParse(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
}

/**
 * createMqttTransportAdapter 简化工厂方法.
 * @param options 参数中文释义: 适配器初始化选项.
 * 设计原因: 对外暴露函数式创建方式,便于按需延迟实例化.
 */
export function createMqttTransportAdapter(options: MqttAdapterOptions): MqttTransportAdapter {
  return new MqttTransportAdapter(options);
}

/**
 * matchMqttTopic MQTT 通配符匹配函数.
 * @param pattern 参数中文释义: 订阅时使用的 topic 模式,支持 + 与 #.
 * @param topic 参数中文释义: 实际收到的 topic.
 * 设计原因: 在单一 message 事件中模拟 broker 的匹配行为,保证多 handler 正确投递.
 */
export function matchMqttTopic(pattern: string, topic: string): boolean {
  // 将 + 替换为单层匹配,将 # 替换为跨层匹配
  const regex = new RegExp(
    '^' +
      pattern
        .replace(/([.$^{[(|)*+?\\])/g, '\\$1')
        .replace(/\\\+/g, '[^/]+')
        .replace(/\\#$/g, '.*')
        .replace(/\\#/g, '.*') +
      '$'
  );
  return regex.test(topic);
}
