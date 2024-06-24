export function isWeb() {
  return typeof window !== 'undefined';
}
// nodejs commanjs 环境
export function isCommonNode() {
  return typeof module !== 'undefined' && module.exports;
}
