export function createOverLoad() {
  const fnMap = new Map<string, Function>();
  function overload(...args: any[]) {
    const key = args.map((arg) => typeof arg).join(',');
    const fn = fnMap.get(key);
    if (!fn) {
      throw new TypeError('No overload function found');
    }
    return fn.apply(this, args);
  }
  overload.addImpl = function (...args: any[]) {
    const fn = args.pop() as Function;
    if (typeof fn !== 'function') {
      throw new TypeError('The last argument must be a function');
    }
    const key = args.join(',');
    fnMap.set(key, fn);
  };
  return overload;
}
