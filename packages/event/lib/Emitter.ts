/**
 * @author
 * @file Emitter.ts
 * @fileBase Emitter
 * @path packages\eventemitter-core\lib\Emitter.ts
 * @from
 * @desc
 * @example
 */

export interface EmitterOptions {
  isRoot: boolean;
  id?: string | number;
}

export class Emitter {
  static defaultOptions: EmitterOptions = Object.freeze({
    isRoot: false,
    id: undefined,
  });
  options: EmitterOptions;
  constructor(options?: Partial<EmitterOptions>) {
    this.options = Object.assign({}, Emitter.defaultOptions, options);
  }
  async emit(event: string, options: EmitOptions) {
    if (this.options.eventbus) {
      await this.options.eventbus.emit(event, options);
    }
    // this.emit(event, options);
  }
  join() {}
}
interface EmitOptions {
  callback(): void;
  wait: boolean;
  eventbus: Eventbus;
}
import { Eventbus } from './Eventbus';
