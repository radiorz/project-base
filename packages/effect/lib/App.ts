import { Effect, EffectManager } from './Onion';
class Protocol {
  buildListenTopic() {
    return 'request';
  }
  buildResponseTopic() {
    return 'response';
  }
}
interface AppOptions {
  protocol: Protocol;
  emitter: Emitter;
}
export class App {
  options: AppOptions;
  constructor(options: AppOptions) {
    this.options = options;
  }
  effects: Effect[] = [];
  use(effect: Effect) {
    this.effects.push(effect);
  }
  async handle(context: any) {
    return await EffectManager.do(context, this.effects);
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
