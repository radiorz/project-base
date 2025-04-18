import { isEqual } from 'lodash';

type ChangeHandler = (path: string, value: any) => void;

export function createReactiveObject<T extends object>(target: T, onChange: ChangeHandler, parentPath: string = ''): T {
  const handler: ProxyHandler<T> = {
    get(target: T, key: string | symbol, receiver: any): any {
      const value = Reflect.get(target, key, receiver);
      // 函数不应修改其绑定的this对象
      if (typeof value === 'function') {
        // 数组修改本身的方法应特殊处理
        if (Array.isArray(target)) {
          return value;
        }
        // 对这两者进行特殊处理
        if (target instanceof Map || target instanceof Set) {
          return value.bind(target); // 绑定原始对象
        }
      } else if (typeof value === 'object' && value !== null) {
        return createReactiveObject(value, onChange, `${parentPath}${String(key)}.`);
      }
      return value;
    },

    set(target: T, key: string | symbol, value: any, receiver: any): boolean {
      const ownTarget = receiver === target ? target : Object.create(target);
      const oldValue = Reflect.get(ownTarget, key, receiver);
      // 对象不等才算更新
      if (!isEqual(oldValue, value)) {
        const path = `${parentPath}${String(key)}`;
        onChange(path, value);
      }

      return Reflect.set(ownTarget, key, value, receiver);
    },
  };

  return new Proxy(target, handler);
}

// // 使用示例
// function handleChange(path: string, value: any): void {
//   console.log(`Property "${path}" changed to`, value);
// }

// const r = createReactiveObject({ a: { b: 1 } }, handleChange);

// r.a.b = 2; // 输出: Property "a.b" changed to 2
