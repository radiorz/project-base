import { Callback } from "../../lib";

const net = require('net');

class TCPClient implements Emitter {
  private socket: net.Socket;
  private callbacks: Map<string, Callback[]>;

  constructor() {
    this.socket = new net.Socket();
    this.callbacks = new Map();

    this.socket.on('data', (data: { toString: () => any; }) => {
      const message = data.toString();
      this.emit('message', message);
    });

    this.socket.on('close', () => {
      this.emit('close');
      console.log('Connection closed');
    });

    this.socket.on('error', (err: any) => {
      this.emit('error', err);
      console.error('Socket error:', err);
    });
  }

  on(topic: string, callback: Callback): void {
    if (!this.callbacks.has(topic)) {
      this.callbacks.set(topic, []);
    }
    this.callbacks.get(topic)!.push(callback);
  }

  emit(topic: string, message: any): void {
    if (topic === 'message') {
      // 这里不需要做任何事情,因为服务器发送的消息会触发 'data' 事件
    } else if (topic === 'close') {
      this.socket.end();
    } else if (topic === 'error') {
      console.error('Error:', message);
    } else {
      this.socket.write(message);
    }

    if (this.callbacks.has(topic)) {
      this.callbacks.get(topic)!.forEach((callback) => callback(topic, message));
    }
  }

  connect(host: string, port: number): void {
    this.socket.connect(port, host, () => {
      this.emit('connect');
      console.log('Connected to server');
    });
  }

  disconnect(): void {
    this.socket.end();
  }
}

// 使用示例
const client = new TCPClient();

client.on('connect', () => {
  console.log('Connected to server');
  client.emit('message', 'Hello, server!');
});

client.on('message', (originMessage) => {
  console.log(`Received message: ${originMessage}`);
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Error:', err);
});

client.connect('localhost', 3000);
