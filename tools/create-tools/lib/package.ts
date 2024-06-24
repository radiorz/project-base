import packageJson from '../package.json';
import { Logger } from '@tikkhun/logger';

export function echoPackage() {
  Logger.log(`[欢迎使用] ${packageJson.name}`);
  Logger.log('版本: ' + packageJson.version);
}
