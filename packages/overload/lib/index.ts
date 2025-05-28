export const DefaultCreateOverloadOptions = {
  getType: (arg: any, index: number, args?: any[]) => typeof arg as unknown,
  delimiter: ',',
  impls: [] as any[],
};
// export interface CreateOverloadOptions extends typeof DefaultCreateOverloadOptions {

// }
export type CreateOverloadOptions = typeof DefaultCreateOverloadOptions;
export function createOverLoad(options: Partial<CreateOverloadOptions> = {}) {
  const opts = Object.assign({}, DefaultCreateOverloadOptions, options);
  const fnMap = new Map<string, Function>();
  function overload(this: any, ...args: any[]) {
    const keys = trimTrailingUndefined(args.map(opts.getType));
    console.log(`keys`, keys);
    const key = keys.join(opts.delimiter);
    const fn = fnMap.get(key);
    if (!fn) {
      throw new TypeError(`No overload function found, key=${key}`);
    }
    return fn.apply(this, args);
  }
  overload.fnMap = fnMap; // 为了方便调试
  overload.addImpl = function (...args: any[]) {
    const fn = args.pop() as Function;
    if (typeof fn !== 'function') {
      throw new TypeError('The last argument must be a function');
    }
    const key = args.join(opts.delimiter);
    fnMap.set(key, fn);
  };
  // 方便添加实现
  for (const impl of opts.impls) {
    overload.addImpl(...impl);
  }
  return overload;
}

function trimTrailingUndefined<T>(arr: T[]): T[] {
  const newArr = [...arr];
  newArr.reduceRight((acc, _, index) => {
    if (newArr[index] === 'undefined') {
      newArr.pop();
    } else {
      return false;
    }
    return true;
  }, true);
  return newArr;
}
