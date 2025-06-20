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
import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import mitt from 'mitt';
import { mergeOptions } from '@tikkhun/utils-core';
import { Deserialize, jsonDeserialize, jsonSerialize, Serialize } from './Serializer';
import { serialize } from 'v8';
export interface UpOptions extends IClientOptions {
  immediately: boolean;
  broker: string;
}
export interface MessengerOptions {
  name: string;
  debug: boolean;
  logger: Console;
  up: UpOptions;
  onError: (error: Error) => void;
  onMessage: (topic: string, message: JSON | any) => void;
  doSubscribe: () => void;
  serialize: Serialize;
  deserialize: Deserialize;
}

export class Messenger {
  static defaultOptions: MessengerOptions = Object.freeze({
    name: 'messager',
    logger: console,
    debug: true,
    up: {
      immediately: false,
      broker: '',
      clientId: 'voerka-visiting',
      // username: '',
      // password: '',
    },
    onError: () => {},
    onMessage: () => {},
    doSubscribe: () => {},
    serialize: jsonSerialize,
    deserialize: (data: any) => jsonDeserialize(data, { allowError: true }),
  });
  options: MessengerOptions;
  // 简化状态
  isOn = false;
  client?: MqttClient;
  emitter = mitt();
  get logger() {
    if (this.options.debug) {
      return null;
    }
    return this.options.logger;
  }
  constructor(options?: Partial<MessengerOptions>) {
    this.options = mergeOptions(Messenger.defaultOptions, options);
    this.logger?.debug?.(`[${this.options.name}] 实例化`, options);
    if (this.options.up.immediately) {
      this.up();
    }
  }
  up(options?: UpOptions) {
    if (this.isOn) {
      // 先下线
      this.down();
    }
    // 如果 options
    if (options) {
      this.options.up = options;
    }
    const { broker, clientId, username, password, reconnectPeriod } = this.options.up;
    this.client = mqtt.connect(broker, {
      clientId,
      reconnectPeriod, // 重新连接时间
      username,
      password,
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
      this.logger?.debug?.('[mqtt服务器]下线,但无需下线,因为无客户端');
      return;
    }
    if (!this.isOn) {
      this.logger?.debug?.('[mqtt服务器]下线,但无需下线,因为状态已下线');
      return;
    }
    this.client.end();
  }
  private onClientConnect() {
    this.logger?.debug?.('[mqtt 客户端]连接成功');
    this.options.doSubscribe(); // 连接就订阅
    this.isOn = true; // 状态
  }
  private onClientDisconnect() {
    console.log(`disconnect`);
    this.isOn = false; // 状态
  }
  private onClientMessage(topic: string, message: Buffer) {
    this.options.onMessage(topic, this.options.deserialize(message));
  }
  private onClientClose() {
    this.logger?.debug?.('[mqtt 客户端]连接关闭');
    this.isOn = false;
  }
  private onClientError(err: Error) {
    this.logger?.error?.(`[mqtt 客户端]出现错误,错误为:`, err.message);
    this.options.onError(err);
  }
  get subscribe() {
    if (!this.client) {
      throw new Error('[mqtt]无客户端');
    }
    return this.client.subscribe.bind(this.client);
  }
  get unsubscribe() {
    if (!this.client) {
      throw new Error('[mqtt]无客户端');
    }
    return this.client.unsubscribe.bind(this.client);
  }
  get publish() {
    return (topic: string, message: any) => {
      if (!this.client) {
        throw new Error('[mqtt]无客户端');
      }
      if (!this.isOn) {
        throw new Error('[mqtt]客户端离线');
      }
      return this.client.publish(topic, this.options.serialize(message));
    };
  }
}
