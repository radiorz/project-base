import { Callback } from '@tikkhun/requestable';

/**
 * @author
 * @file Layer.ts
 * @fileBase Layer
 * @path packages\requestable-tcp\lib\Router\Layer.ts
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */
export interface Handler {
  (message: any): void;
}
export class Layer {
  constructor(
    public path: string,
    private handler: Function,
  ) {}
  handle(message: any) {
    return this.handler(message);
  }
}
