import { styleObjectToString } from "./styleObjectToString";

export function styledLog(text: string, style: Record<string, any>) {
  // 将 style 对象转换为 CSS 样式字符串
  const styleString = styleObjectToString(style)

  // 使用转换后的样式字符串调用 console.log
  console.log(`%c${text}`, styleString);
}

