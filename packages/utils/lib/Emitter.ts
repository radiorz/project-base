export type EventCallback = (...args: any[]) => void;

export class Emitter {
  private listeners: { [eventName: string]: EventCallback[] } = {};

  on(eventName: string, callback: EventCallback, signal?: AbortSignal) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);

    if (signal) {
      // 如果signal已经中止，立即移除监听器
      if (signal.aborted) {
        this.off(eventName, callback);
        return;
      }

      // 添加signal的abort事件监听
      signal.addEventListener(
        'abort',
        () => {
          this.off(eventName, callback);
        },
        { once: true },
      );
    }
  }
  once(eventName: string, callback: EventCallback) {
    // 被调用后off
    const wrapper = (...args: any[]) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
  off(eventName: string, callback: EventCallback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter((listener) => listener !== callback);
    }
  }
  // 清空全部
  offAll(eventName?: string) {
    if (eventName) {
      delete this.listeners[eventName];
    } else {
      // 清除所有引用，帮助垃圾回收
      for (const key in this.listeners) {
        delete this.listeners[key];
      }
      // 或者直接
      // this.listeners = {};
    }
  }

  emit(eventName: string, ...args: any[]) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => {
        callback(...args);
      });
    }
  }
}
