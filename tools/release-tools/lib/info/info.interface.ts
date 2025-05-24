export interface Info {
  name?: string | null; // 名称
  title?: string | null; // 标题
  version?: string | null; // 版本号
  description?: string | null; // 描述
  tag?: string | null; // 标签 比如 beta
  system?: string | null; // 系统
  hardware?: string | null; // 硬件
  releasedAt?: number | null; // Date.now 返回的时间戳
  fileSize?: number | null; // 文件大小
  fileMd5?: string | null; // 文件md5
  mainFilePath?: string; // 主文件路径
  mainFileName?: string; // 主文件名
  [props: string]: any; // 可以拓展任何其他的信息只要你愿意
}
