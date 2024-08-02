import { it, expect } from 'vitest';
import { Message, Requestable, Responsive } from './index';
import { Emitter } from './index';
import { faker } from '@faker-js/faker';
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
  function handler(data: any) {
    return data;
  }
  const url = faker.string.uuid();
  responsive.addRoute(url, handler);
  responsive.init();
  const requestable = new Requestable({
    emitter: emitter,
  });
  requestable.init();
  const requestMessage = {
    url: url,
    payload: { name: faker.string.uuid() },
  };
  const result = await requestable.request(requestMessage);
  const handlerResult = await handler(requestMessage.payload);
  expect(result.payload).toBe(handlerResult);
  expect(result.url).toBe(requestMessage.url);
});
it('response 404', async () => {
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
    payload: null,
  };
  const result = await requestable.request(requestMessage);
  console.log(`result`, result);
  expect(result.payload.status).toBe(404);
  expect(result.url).toBe(requestMessage.url);
});
