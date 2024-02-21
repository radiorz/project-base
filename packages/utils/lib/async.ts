/**
 * 停止运行多少时间
 * @param time 时间
 */
export async function sleep(time: number) {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
