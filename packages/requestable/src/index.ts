import { Emitter, Callback, Requestable, Responsive } from '../lib';

// 模拟一下
const emitter: Emitter = {
  callbacks: [] as Callback[],
  on(topic: string, callback: Callback) {
    this.callbacks.push(callback);
  },
  off(callback: any) {
    this.callbacks = this.callbacks.filter((c: Callback) => c === callback);
  },
  emit(topic: string, message: any) {
    this.callbacks.forEach((callback: Callback) => {
      callback(topic, message);
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
  const responseFail = await requestable.request({
    url: 'hhhh',
    payload: {},
  });
  console.log(`response`, responseFail);
}
bootstrap();
