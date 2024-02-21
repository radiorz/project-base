/**
 * @author
 * @file time.ts
 * @fileBase time
 * @path packages\utils\lib\time.ts
 * @from 
 * @desc 跟时间有关的函数
 * @todo
 * 
 *
 * @done
 * @example
 */
/**
 * 停止运行多少时间
 * @param time 时间
 */
export async function sleep(time: number) {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
