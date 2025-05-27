export enum PLATFORM {
  "WINDOWS" = "WINDOWS", //
  "LINUX" = "LINUX",
}
// 发布类型
export enum DEPLOY_TYPE {
  "JUST_APP" = "JUST_APP", // 只是代码替换
  "FULL" = "FULL", // 包括运维工具 // 包括 data vendor ,源代码,script for platform(ops)
}

