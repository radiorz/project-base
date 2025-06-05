/**
 * @function blockIframe
 * @description 函数用于
 * @param
 * @returns
 * @example
 * blockIframe() // ->
 */
export function blockIframe() {
  if (top && top !== window) {
    top.location.href = window.location.href;
  }
}
