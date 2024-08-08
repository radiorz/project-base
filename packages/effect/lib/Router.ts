import { Skin, Onion } from './Onion';
import { Emitter } from '@tikkhun/requestable';
class Protocol {
  buildListenTopic() {
    return 'request';
  }
  buildResponseTopic() {
    return 'response';
  }
}
interface RouterOptions {
  protocol: Protocol;
  emitter: Emitter;
}
export class Router {
  options: RouterOptions;
  constructor(options: RouterOptions) {
    this.options = options;
  }
  effects: Skin[] = [];
  use(effect: Skin) {
    this.effects.push(effect);
  }
  async handle(context: any) {
    return await Onion.do(context, this.effects);
  }
  listen() {
    // 不断发送请求过来
    this.options.emitter.on(this.options.protocol.buildListenTopic(), this.onMessage.bind(this));
  }
  async onMessage(message: any) {
    const result = await this.handle(message);
    this.options.emitter.emit(this.options.protocol.buildResponseTopic(), result);
  }
}
