/**
 * Unsubscribe 取消订阅函数.
 * 设计原因: 用函数类型表达资源释放,让调用方以最小心智负担管理订阅生命周期.
 */
export type Unsubscribe = () => void;

/**
 * TransportAdapter 传输适配器接口.
 * 设计原因: 以 publish/subscribe 形式统一消息 IO,让协议层不关注底层是 MQTT,NATS,WebSocket 或其他实现.
 */
export interface TransportAdapter {
  /**
   * 发布消息到 topic.
   * @param topic topic 字符串,例如 mqtt topic.
   * @param message 消息体.
   * 设计原因: 抽象 transport,让上层不绑定具体 MQ,WebSocket,HTTP 等实现.
   */
  publish(topic: string, message: any): Promise<void> | void;
  /**
   * 订阅 topic.
   * @param topic topic 字符串,支持通配符取决于具体实现.
   * @param handler 回调函数,携带实际 topic 与消息体.
   * @returns Unsubscribe 取消订阅函数.
   */
  subscribe(topic: string, handler: (topic: string, message: any) => void): Unsubscribe | void;
}
