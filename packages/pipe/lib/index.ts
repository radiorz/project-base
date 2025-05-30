// pipe // 这里的 pipe 是一个函数组合器，接受多个函数作为参数，并返回一个新的函数

// 同步版本的 pipe 函数
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T): T =>
    fns.reduce((acc, fn) => fn(acc), x);

// 异步版本的 pipe 函数
export const asyncPipe =
  <T>(...fns: Array<(arg: T) => Promise<T> | T>) =>
  async (x: T): Promise<T> => {
    // 初始值
    let result: T = x;
    for (const fn of fns) {
      // 调用函数并等待结果
      result = await fn(result);
    }
    return result;
  };

