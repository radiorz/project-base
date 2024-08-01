import { Responsive } from '../lib';
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
  emit(topic: string, message: Message) {
    this.callbacks.forEach((callback) => {
      callback(message);
    });
  },
};
async function bootstrap() {
  const responsive = new Responsive({ emitter: emitter });
  responsive.addRoute('hello', (data) => {
    console.log(`hello data`, data);
    return data;
  });
  responsive.init();
  const requestable = new Requestable({
    emitter: emitter,
  });
  requestable.init();
  const result = await requestable.request({
    url: 'hello',
    payload: {
      1: 123,
    },
  });
  console.log(`result`, result);
  const response = await requestable.request({
    url: 'hhhh',
    payload: {},
  });
  console.log(`response`, response);
}
bootstrap();
