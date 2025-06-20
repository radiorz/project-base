/*
 * @FilePath: \voerkacloud-project\apps\visiting\src\meeting-event\messenger\Messenger.ts
 * @Author: zk.su
 * @Date: 2025-06-19 15:54:43
 * @LastEditTime: 2025-06-19 17:40:47
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
/**
 * @author
 * @file MessenGer.ts
 * @fileBase MessenGer
 * @path apps\visiting\src\meeting-event\messenger\MessenGer.ts
 * @from
 * @desc
 * @example
 */
import mqtt, { MqttClient } from 'mqtt';
import mitt from 'mitt';
import { mergeOptions } from '@tikkhun/utils-core';
export interface UpOptions {
  immediately: boolean;
  broker: string;
  username: string;
  password: string;
  clientId: string;
}
export interface MessengerOptions {
  name: string;
  debug: boolean;
  logger: Console;
  reconnectWaitTime: number; // 0 就是不重启 毫秒
  up: UpOptions;
  onError: (error: Error) => void;
  onMessage: (topic: string, message: JSON | any) => void;
  doSubscribe: () => void;
}

export class Messenger {
  static defaultOptions: MessengerOptions = Object.freeze({
    name: 'messager',
    logger: console,
    debug: true,
    reconnectWaitTime: 0, // 0 就是不重启
    up: {
      immediately: false,
      clientId: 'voerka-visiting',
      broker: '',
      username: '',
      password: '',
    },
    onError: () => {},
    onMessage: () => {},
    doSubscribe: () => {},
  });
  options: MessengerOptions;
  // 简化状态
  on = false;
  client?: MqttClient;
  emitter = mitt();
  get logger() {
    return this.options.logger;
  }
  constructor(options?: Partial<MessengerOptions>) {
    this.options = mergeOptions(Messenger.defaultOptions, options);
    if (this.options.up.immediately) {
      this.up();
    }
  }
  up(options?: UpOptions) {
    if (this.on) {
      // 先下线
      this.down();
    }
    // 如果 options
    if (options) {
      this.options.up = options;
    }
    const { clientId, broker, username, password } = this.options.up;
    this.client = mqtt.connect(broker, {
      username,
      password,
      clientId,
    });
    this.client.on('connect', this.onClientConnect.bind(this));
    this.client.on('disconnect', this.onClientDisconnect.bind(this));
    this.client.on('message', this.onClientMessage.bind(this));
    this.client.on('close', this.onClientClose.bind(this));
    this.client.on('end', this.onClientClose.bind(this));
    this.client.on('error', this.onClientError.bind(this));
  }
  down() {
    if (!this.client) {
      this.logger.debug('[mqtt服务器]下线,但无需下线,因为无客户端');
      return;
    }
    if (!this.on) {
      this.logger.debug('[mqtt服务器]下线,但无需下线,因为状态已下线');
      return;
    }
    this.client.end();
  }
  private onClientConnect() {
    this.logger.debug('[mqtt 客户端]连接成功');
    this.options.doSubscribe(); // 连接就订阅
    this.on = true; // 状态
  }
  private onClientDisconnect() {
    this.on = false; // 状态
  }
  private onClientMessage(topic: string, message: Buffer) {
    try {
      const jsonMessage = JSON.parse(message.toString());
      this.options.onMessage(topic, jsonMessage);
    } catch (error) {
      this.options.onMessage(topic, message);
    }
  }
  private onClientClose() {
    this.logger.debug('[mqtt 客户端]连接关闭');
    this.on = false;
  }
  private onClientError(err: Error) {
    this.logger.error(`[mqtt 客户端]出现错误,错误为:`, err.message);
    this.options.onError(err);
  }
  get subscribe() {
    if (!this.on) {
      throw new Error('客户端未启动');
    }
    return this.client!.subscribe.bind(this);
  }
  get unsubscribe() {
    if (!this.on) {
      throw new Error('客户端未启动');
    }
    return this.client!.unsubscribe.bind(this);
  }
  get publish() {
    if (!this.on) {
      throw new Error('客户端未启动');
    }
    return this.client!.publish.bind(this);
  }
}
