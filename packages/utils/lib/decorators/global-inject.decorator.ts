// global-inject.decorator.ts
export function GlobalInject(globalKey?: string): ClassDecorator {
  return (target: any) => {
    // 创建新的构造函数
    const newConstructor: any = function (...args: any[]) {
      const instance = new (target as any)(...args);
      (globalThis as any)[globalKey || `\$${target.name}`] = instance;
      return instance;
    };

    // 复制原型链
    newConstructor.prototype = Object.create(target.prototype);
    newConstructor.prototype.constructor = target;

    // 返回新的构造函数
    return newConstructor;
  };
}
