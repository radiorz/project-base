import { ConfigStore } from './ConfigStore';
import { Store, VersionTarget } from './Store';
import { TextStore } from './TextStore';

/**
 * @description store 工厂.
 */
export class StoreFactory {
  /**
   * @description 根据目标配置创建 store.
   * @param target 目标配置.
   */
  static create(target: VersionTarget): Store {
    if (target.type === 'text') {
      return new TextStore(target);
    }
    if (target.type === 'custom') {
      return new CustomStore(target);
    }
    return new ConfigStore(target);
  }
}

/**
 * @description 自定义 store.
 */
class CustomStore implements Store {
  /**
   * @description 当前 store 绑定的目标.
   */
  target: Extract<VersionTarget, { type: 'custom' }>;

  /**
   * @description 初始化自定义 store.
   * @param target 目标配置.
   */
  constructor(target: Extract<VersionTarget, { type: 'custom' }>) {
    this.target = target;
  }

  /**
   * @description 调用自定义读取逻辑.
   */
  async get() {
    if (!this.target.get) {
      return {
        action: 'get' as const,
        success: false,
        file: this.target.file,
        type: this.target.type,
        message: 'custom get is not implemented',
      };
    }
    try {
      const value = await this.target.get(this.target.file);
      return {
        action: 'get' as const,
        success: true,
        file: this.target.file,
        type: this.target.type,
        value,
      };
    } catch (error) {
      return {
        action: 'get' as const,
        success: false,
        file: this.target.file,
        type: this.target.type,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * @description 调用自定义写入逻辑.
   * @param value 版本值.
   */
  async set(value: string | number) {
    try {
      const oldResult = await this.get();
      if (!this.target.set) {
        return {
          action: 'set' as const,
          success: false,
          file: this.target.file,
          type: this.target.type,
          oldValue: oldResult.success ? oldResult.value : undefined,
          newValue: value,
          message: 'custom set is not implemented',
        };
      }
      await this.target.set(value, this.target.file);
      return {
        action: 'set' as const,
        success: true,
        file: this.target.file,
        type: this.target.type,
        oldValue: oldResult.success ? oldResult.value : undefined,
        newValue: value,
      };
    } catch (error) {
      return {
        action: 'set' as const,
        success: false,
        file: this.target.file,
        type: this.target.type,
        newValue: value,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * @description 调用自定义更新逻辑.
   * @param value 版本值.
   */
  async update(value: string | number) {
    const result = await this.set(value);
    return {
      ...result,
      action: 'update' as const,
    };
  }
}
