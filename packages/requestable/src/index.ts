import { Requestable } from '../lib/Requestable';

interface Message {
  sessionId: string;
  url: string;
  type: 'Request' | 'Response';
}
// 模拟一下
const emitter = {
  callbacks: [] as any[],
  on(topic: string, callback: any) {
    this.callbacks.push(callback);
  },
  off(callback: any) {
    this.callbacks = this.callbacks.filter((c) => c === callback);
  },
  emit(message: Message) {
    this.callbacks.forEach((callback) => {
      callback({
        type: 'Response',
        sessionId: message.sessionId,
        url: message.url,
        payload: {},
      });
    });
  },
};
async function bootstrap() {
  const requestable = new Requestable({
    emitter: emitter,
  });
  const result = await requestable.request({
    url: 'hello',
    payload: {
      1: 123,
    },
  });
  console.log(`result`, result);
}
bootstrap();
