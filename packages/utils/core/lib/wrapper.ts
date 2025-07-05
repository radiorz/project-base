// 当错误的时候直接返回提示信息
export function withTip(checkFunc: (value: any) => boolean, tip: string = "") {
  return (value: any) => checkFunc(value) || tip;
}
