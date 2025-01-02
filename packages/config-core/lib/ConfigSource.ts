export interface ConfigSource {
  // 初始化
  init?: () => void;
  // 用来加载初始配置
  load: () => Record<string, any>;
  reset?: (path?: string) => void;
  // 用来同步配置进行新的保存
  save?: (path: string, value: any) => void;
}
