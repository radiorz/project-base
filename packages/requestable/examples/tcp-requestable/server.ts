import net from 'net';
import { Emitter, Callback } from '../../lib/Emitter';
import { Responsive } from '../../lib';
class TCPServer implements Emitter {
  private server: net.Server;
  private callbacks: Map<string, Callback[]>;

  constructor() {
    this.server = net.createServer((socket) => {
      console.log('Client connected');

      socket.on('data', (data) => {
        const message = data.toString();
        this.emit('message', message);
      });

      socket.on('end', () => {
        console.log('Client disconnected');
      });
    });

    this.callbacks = new Map();
  }

  on(topic: string, callback: Callback): void {
    if (!this.callbacks.has(topic)) {
      this.callbacks.set(topic, []);
    }
    this.callbacks.get(topic)!.push(callback);
  }

  emit(topic: string, message: any): void {
  
  }

  start(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

// 使用示例
const server = new TCPServer();
server.on('message', (topic, message) => {
  console.log(`Received message: ${message}`);
});
server.start(3000);

const responsive = new Responsive({ emitter: server });
responsive.start();
