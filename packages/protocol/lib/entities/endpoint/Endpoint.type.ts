import { Description, ID } from '@/core';
import { EndpointType } from './EndpointType.type';

export interface EndpointSchema extends Description {
  type: EndpointType['name'];
  configSchema: Record<string, any>;
}

export interface Endpoint extends Description {
  id: ID;
  type: EndpointSchema['name'];
  subType: 'string'; // 子型号啥的 ABCD
  version?: string; // 当前版本
  // 下面其实都是配置
  domain?: string; // 领域
  debug?: boolean; // 是否调试模式 有啥用？
  language?: string; // 语言
  timezone?: string; // 时区
  charset?: string; // 字符集

  config: Record<string, any>;
}
