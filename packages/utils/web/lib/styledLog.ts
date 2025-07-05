import { tranKeyToDashCase } from '@tikkhun/utils-core';

export function styledLog(text: string, style: Record<string, any>) {
  // 将 style 对象转换为 CSS 样式字符串
  const styleString = tranKeyToDashCase(style);

  // 使用转换后的样式字符串调用 console.log
  console.log(`%c${text}`, styleString);
}
