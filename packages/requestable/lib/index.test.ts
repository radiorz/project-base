import { it, expect } from 'vitest';
import { Message, Requestable, Responsive } from './index';
import { Emitter } from './index';
it('request response work', async () => {
  // 模拟一下
  const emitter: Emitter = {
    callbacks: [] as any[],
    on(topic: string, callback: any) {
      this.callbacks.push(callback);
    },
    off(callback: any) {
      this.callbacks = this.callbacks.filter((c: any) => c === callback);
    },
    emit(topic: string, message: Message) {
      this.callbacks.forEach((callback: any) => {
        callback(message);
      });
    },
  };
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
  const requestMessage = {
    url: 'hello',
    payload: {
      1: 123,
    },
  };
  const result = await requestable.request(requestMessage);
  expect(result.payload).toBe(requestMessage.payload);
  expect(result.url).toBe(requestMessage.url);
});
it('request response work', async () => {
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
  const responsive = new Responsive({ emitter: emitter });
  responsive.init();
  const requestable = new Requestable({
    emitter: emitter,
  });
  requestable.init();
  const requestMessage = {
    url: 'hello',
    payload: {
      1: 123,
    },
  };
  const result = await requestable.request(requestMessage);
  expect(result.payload.status).toBe(404);
  expect(result.url).toBe(requestMessage.url);
});
