// pipe // 这里的 pipe 是一个函数组合器，接受多个函数作为参数，并返回一个新的函数
type AnyFunction = (...args: any[]) => any;

// 同步版本的 pipe 函数
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduce((acc, fn) => fn(acc), x);

// 异步版本的 pipe 函数
export const asyncPipe =
  <T>(...fns: Array<(arg: T) => Promise<T> | T>) =>
  async (x: T): Promise<T> =>
    fns.reduce(async (acc, fn) => fn(await acc), x);
