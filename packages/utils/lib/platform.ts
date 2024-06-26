export function isWeb() {
  return typeof window !== 'undefined';
}
// nodejs commanjs 环境
export function isCommonNode() {
  return typeof module !== 'undefined' && module.exports;
}

export function isWindows() {
  return process.platform === 'win32';
}

export function isPowershell() {
  
}
export function isLinux() {
  return process.platform === 'linux';
}
