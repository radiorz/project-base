export function isClientWindows() {
  return (window.navigator as any)?.userAgentData?.platform === 'Windows' || navigator?.platform === 'Win32';
}
export function isAndroid() {
  throw new Error('impl not ready');
}
