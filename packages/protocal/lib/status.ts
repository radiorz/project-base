interface StatusCategory {
  name: string // 状态名称
  title: string //
  description: string;
  // 渲染
  icon: string; // 图标
  default: number; // 
  enumDict: Status[]
}

interface Status {
  value: number;
  name: string; // 状态名称
  title: string;//
  description: string;
  // 渲染
  icon: string; // 图标
}
