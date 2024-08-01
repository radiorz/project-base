# requestable

在普通的emitter上包装一层，以支持类似http的请求响应模式

实际工作中经常会用到单向触发的api

- tcp
- mqtt
- window.parent.postMessage window.addEventListener('message',onMessage)

有时我们想要等待一个请求产生的结果，那么只需要使用 Requestable 包裹一下客户端，Responsive 包装一下服务端，即可使用请求响应的模式。

## 使用

```javascript
import { type Message, Requestable, Responsive } from '../lib';

// 模拟emitter(这个emitter可以是多种多样)
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

```

## 未完待续

server -> like express

route -> wildcard support

// 或者 like trpc  server 即 client（类型提醒，直接执行方法）
