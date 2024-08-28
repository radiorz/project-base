import { ConfigStorage } from './ConfigStorage';

export class MemoryStorage implements ConfigStorage {
  _config: Record<string, any> = {};
  get() {
    return this._config;
  }
  set(value: Record<string, any>) {
    this._config = value;
  }
}
