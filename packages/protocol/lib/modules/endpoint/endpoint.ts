import { Description, ID } from '@tikkhun/protocol-core';
import { EndpointType } from './endpoint-type';

export interface EndpointSchema extends Description {
  type: EndpointType['name'];
  configSchema: Record<string, any>;
}

export interface Endpoint extends Description {
  id: ID;
  type: EndpointSchema['name'];
  subType: 'string'; // 子型号啥的 ABCD
  version?: string; // 当前版本
  // 具体配置
  domain?: string; // 领域
  debug?: boolean; // 是否调试模式 有啥用？
  language?: string; // 语言
  timezone?: string; // 时区
  charset?: string; // 字符集
  modules: string[]; // 允许的模块
  config: Record<string, any>;
}
