export function trimTrailingUndefined<T>(arr: T[]): T[] {
  let endIndex = arr.length;
  // 从数组末尾开始遍历，找到第一个不为 undefined 的元素的索引
  while (endIndex > 0 && arr[endIndex - 1] === undefined) {
    endIndex--;
  }
  return arr.slice(0, endIndex);
}
