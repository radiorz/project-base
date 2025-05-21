// 将驼峰式命名转换为连字符分隔的 CSS 属性名
export function toDashCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
