// ● 1：事务正在处理
// ● 2：事务被挂起
// ● 3：事务被恢复
// ● 10：事务已完成
// ● 11：未服务
// ● 12：事务被忽略
// ● 13：事务被转移
// ● 14：事务被拒绝
// ● 15：事务超时结束
// ● 16：事务被判误触
// ● 19：事务出错结束

export enum AffairResult {
  handling, // 正在处理中
  pause, // 暂停
  resume, // 恢复

  done = 10, // 结束
  unserve = 11, // 未服务
  ignore, // 被忽略
  transfer, // 被转移
  refuse, // 被拒绝
  timeout, // 超时
  misjudge, // 被判误触
  error = 19, // 错误
}


export function isAffairOver(result: AffairResult) {
  return result >= 10;
}
export function isNewAffair(result: AffairResult) {
  return result < 10;
}
