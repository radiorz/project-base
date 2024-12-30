import { optionsMerge } from '../../utils/lib/object';
/**
 * @author
 * @file Node.ts
 * @fileBase Node
 * @path packages\eventemitter-core\lib\Node.ts
 * @from
 * @desc
 * @example
 */

export interface NodeOptions {
  name?: string | number | (() => string | number);
  priority: number;
}

export class Node {
  static defaultOptions: NodeOptions = Object.freeze({
    name: this.constructor.name, // 非单例将会重复
    priority: 0,
  });
  _name: string | number;
  get name() {
    return this._name;
  }
  private getName() {
    if (typeof this.options.name === 'function') {
      return this.options.name();
    }
    return this.options.name!;
  }
  options: NodeOptions;
  constructor(options?: Partial<NodeOptions>) {
    this.options = optionsMerge(Node.defaultOptions, options);
    this._name = this.getName();
  }
  
}
