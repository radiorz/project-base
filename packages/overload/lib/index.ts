import { trimTrailingUndefined } from './trimTrailingUndefined';
import { flattenNestedArray } from './flattenNestedArray';

// 定义一个类型，用于表示实现函数的参数和返回值
type ImplFunction = (...args: any[]) => any;

// 定义默认选项类型
export const DefaultCreateOverloadOptions = {
  getType: (arg: any, index: number, args?: any[]) => typeof arg as unknown,
  delimiter: ',',
  impls: [] as [...Parameters<ImplFunction>, ImplFunction][],
};

export type CreateOverloadOptions = typeof DefaultCreateOverloadOptions;

// 为 createOverLoad 添加泛型
export function createOverLoad<F extends ImplFunction>(options: Partial<CreateOverloadOptions> = {}) {
  const opts = Object.assign({}, DefaultCreateOverloadOptions, options);
  const fnMap = new Map<string, F>();

  // 定义 overload 函数类型
  function overload(this: any, ...args: Parameters<F>): ReturnType<F> {
    const keys = trimTrailingUndefined(args).map(opts.getType);
    const key = keys.join(opts.delimiter);
    const fn = fnMap.get(key);
    if (!fn) {
      throw new TypeError(`No overload function found, key=${key}`);
    }
    return fn.apply(this, args);
  }

  overload.fnMap = fnMap; // 为了方便调试
  overload.addImpl = function (...args: [...Parameters<F>, F]) {
    const fn = args.pop() as F;
    if (typeof fn !== 'function') {
      throw new TypeError('The last argument must be a function');
    }
    const flatKeys = flattenNestedArray(args);
    flatKeys.forEach((keys) => {
      const key = keys.join(opts.delimiter);
      fnMap.set(key, fn);
    });
  };

  // 方便添加实现
  for (const impl of opts.impls) {
    overload.addImpl(...(impl as [...Parameters<F>, F]));
  }

  return overload;
}
