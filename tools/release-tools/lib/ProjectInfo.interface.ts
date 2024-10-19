export interface ToJsonOptions {
  optionsMap?: null | Record<string, string>;
}
export interface ProjectInfo {
  projectName?: string;
  version?: string;
  releasedAt?: string;
  stringify: () => string;
  parse?: (str: string) => ProjectInfoParsed;
  toJson: (options?: ToJsonOptions) => Record<string, any> | Promise<Record<string, any>>;
}

export interface ProjectInfoParsed {
  projectName?: string;
  version?: string;
  versionTag?: string;
  releasedAt?: string;
  environment?: string;
  fileSize?: number | null;
  fileMD5?: string | null;
}
export type stringifyParam = 'projectName' | 'version' | 'versionTag' | 'releasedAt' | 'system' | 'hardware';
export interface ProjectInfoOptions {
  projectName?: string; // 项目名称

  workspace: string; // 工作空间

  filePath?: string; // 文件
  versionTag: string; // 比如beta1 这种标签

  timePattern: string; // 时间的具体格式

  system: string; // 系统

  hardware: string; // 硬件
  // 基本用于打包后的文件名
  // stringify分隔符
  stringifyDelimiter: string;
  // stringify参数
  stringifyParams: stringifyParam[];
}
