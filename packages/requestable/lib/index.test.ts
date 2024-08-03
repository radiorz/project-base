import { faker } from '@faker-js/faker';
import { expect, it, vi } from 'vitest';
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
  const handlerMock = vi.fn().mockImplementation(() => 1);
  const url = faker.string.uuid();
  responsive.addRoute(url, handlerMock);
  responsive.start();
  const requestable = new Requestable({
    emitter: emitter,
  });
  requestable.start();
  const requestMessage = {
    url: url,
    payload: { name: faker.string.uuid() },
  };
  const result = await requestable.request(requestMessage);
  // 被调用了一次
  expect(handlerMock.mock.calls.length).toBe(1);
  // handler传入参数是对的
  expect(handlerMock.mock.calls[0][0]).toBe(requestMessage.payload);
  // 处理结果url正确
  expect((result as ResponseMessage).url).toBe(requestMessage.url);
  // 处理结果正确
  const handlerResult = await handlerMock(requestMessage.payload);
  expect((result as ResponseMessage).payload).toBe(handlerResult);
});
it('response 404', async () => {
  // 模拟一下
  const emitter = getEmitter();
  const responsive = new Responsive({ emitter: emitter });
  responsive.start();
  const requestable = new Requestable({
    emitter: emitter,
  });
  requestable.start();
  const requestMessage = {
    url: faker.string.alphanumeric(),
    payload: null,
  };
  const result = await requestable.request(requestMessage);
  console.log(`result`, result);
  expect((result as ResponseMessage).payload.status).toBe(404);
  expect((result as ResponseMessage).url).toBe(requestMessage.url);
});
