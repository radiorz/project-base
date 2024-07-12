// isWeb
export function isClient() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
// nodejs commanjs 环境
export function isCommonNode() {
  return typeof module !== 'undefined' && module.exports;
}

export function isPowershell() {
  throw new Error('impl not ready');
}

export function isWindows() {
  return process.platform === 'win32';
}
export function isLinux() {
  return process.platform === 'linux';
}
