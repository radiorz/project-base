/**
 * @author
 * @file Router.ts
 * @fileBase Router
 * @path packages\requestable-tcp\lib\Router.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { Callback } from '@tikkhun/requestable';
import { Layer } from './Layer';
export class Router {
  removeLayer(layer: Layer) {
    this.layers = this.layers.filter((_layer) => _layer !== layer);
  }
  layers: Layer[] = []; //
  addLayer(layer: Layer) {
    this.layers.push(layer);
  }
  private defaultDone() {
    return {
      status: 404,
      message: 'layer is not defind',
    };
  }
  handle(path: string, message: any, done: Function = this.defaultDone) {
    const layer = this.getLayerByPath(path);
    if (!layer) return done();
    return layer.handle(message);
  }
  getLayerByPath(path: string) {
    return this.layers.find((layer) => layer.path === path);
  }
}
