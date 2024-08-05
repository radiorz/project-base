import { Callback, type Emitter } from '@tikkhun/requestable';
import { Server, Socket } from 'net';
import { Router } from './Router/Router';
import { Layer } from './Router/Layer';
export interface TCPServerEmitterOptions {
  server: Server;
}
export class TCPServerEmitter implements Emitter {
  options: TCPServerEmitterOptions;
  router: Router;
  constructor(options: TCPServerEmitterOptions) {
    this.options = options;
    this.onMessage = this.onMessage.bind(this);
    this.options.server.on('message', this.onMessage);
    this.router = new Router();
  }
  private onMessage(message: any) {
    console.log(`message`, message);
  }
  on(eventType: string, callback: Callback): void {
    this.router.addLayer(new Layer(eventType, callback));
  }
  off(eventType: string, callback: Callback): void {
    const layer = this.router.getLayerByPath(eventType, callback);
    this.router.removeLayer(layer);
  }
  emit(topic: string, message: any): void {
    const socket: Socket = this.socket.write(topic, message);
  }
}
