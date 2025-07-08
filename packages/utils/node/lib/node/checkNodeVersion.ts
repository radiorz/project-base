import { getCurrentNodeVersion } from './currentNodeVersion';

export function checkNodeVersion(minVersion = 16, maxVersion: number) {
  const version = parseInt(getCurrentNodeVersion());
  if (version < minVersion) {
    throw new Error(`你的 Node.js 版本过低，请升级到 Node.js ${minVersion} 或更高版本。`);
  }
  if (maxVersion && version > maxVersion) {
    throw new Error(`你的 Node.js 版本过高，请降级到 Node.js ${maxVersion} 或更低版本。`);
  }
  return true;
}
