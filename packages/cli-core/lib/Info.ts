// 消息显示等
import { Logger } from '@tikkhun/logger';

export function echoPackage(packageJson: Record<string, any>) {
  Logger.log(`[欢迎使用] ${packageJson.name}`);
  Logger.log('版本: ' + packageJson.version);
}
/**
 * echo info
 * @param info
 */
export function echo(info: Record<string, any>) {
  // logo
  if (info.logo) console.log(info.logo);
  // 名称
  Logger.log(`[欢迎使用] ${info.name}`);
  // 版本
  Logger.log('版本: ' + info.version);
}
