export interface ConfigStorage {
  get(): Record<string, any>;
  set(config: Record<string, any>): void;
}

