/**
 * @author
 * @file Eventbus.ts
 * @fileBase Eventbus
 * @path packages\eventemitter-core\lib\Eventbus.ts
 * @from 
 * @desc 
 * @example
 */

export interface EventbusOptions {

}

export class Eventbus {
  static defaultOptions:EventbusOptions = Object.freeze({
  
  })
  options: EventbusOptions
  constructor(options?: Partial<EventbusOptions>) {
    this.options = Object.assign({}, Eventbus.defaultOptions, options);
  }
}
