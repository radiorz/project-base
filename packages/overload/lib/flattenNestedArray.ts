export function flattenNestedArray<T>(arr: (T | T[])[]) {
  // 初始化结果数组，放入一个空数组作为起始状态
  let result: (T | undefined)[][] = [[]];

  for (const item of arr) {
    if (Array.isArray(item)) {
      if (item.length === 0) {
        result = result.map((partial) => [...partial, undefined]);
      } else {
        // 如果当前元素是数组，生成新的组合
        const newResult: (T | undefined)[][] = [];
        for (const partial of result) {
          for (const element of item) {
            newResult.push([...partial, element]);
          }
        }
        result = newResult;
      }
    } else {
      // 如果当前元素不是数组，直接添加到已有组合中
      result = result.map((partial) => [...partial, item]);
    }
  }

  return result;
}
