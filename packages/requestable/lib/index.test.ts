import { faker } from '@faker-js/faker';
import { expect, it } from 'vitest';
import { Emitter, Requestable, ResponseMessage, RequestMessage, Responsive } from './index';
function getEmitter() {
  const emitter: Emitter = {
    callbacks: [] as any[],
    on(topic: string, callback: any) {
      this.callbacks.push(callback);
    },
    off(callback: any) {
      this.callbacks = this.callbacks.filter((c: any) => c === callback);
    },
    emit(topic: string, message: any) {
      this.callbacks.forEach((callback: any) => {
        callback(topic, message);
      });
    },
  };
  return emitter;
}
it('request response work', async () => {
  // 模拟一下
  const emitter = getEmitter();
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
  expect((result as ResponseMessage).payload).toBe(handlerResult);
  expect((result as ResponseMessage).url).toBe(requestMessage.url);
});
it('response 404', async () => {
  // 模拟一下
  const emitter = getEmitter();
  const responsive = new Responsive({ emitter: emitter });
  responsive.init();
  const requestable = new Requestable({
    emitter: emitter,
  });
  requestable.init();
  const requestMessage = {
    url: faker.string.alphanumeric(),
    payload: null,
  };
  const result = await requestable.request(requestMessage);
  console.log(`result`, result);
  expect((result as ResponseMessage).payload.status).toBe(404);
  expect((result as ResponseMessage).url).toBe(requestMessage.url);
});
