import { Description } from "../consts";
import { ID } from "../id";
import { EndpointType } from "./EndpointType.type";


export interface EndpointSchema extends Description {
  type: EndpointType['name'];
  configSchema: Record<string, any>;
}

export interface Endpoint extends Description {
  id: ID;
  type: EndpointSchema['name'];
  subType: 'string'; // 子型号啥的 ABCD
  version?: string; // 当前版本
  language?: string; // 语言
  domain?: string; // 领域
  debug?: boolean; // 是否调试模式 有啥用？
  timezone?: string; // 时区
  charset?: string; // 字符集
  location?: Location; // 地址
  config: Record<string, any>
}

interface Location {
  map: string; // 地图
  label: string; // 安装位置
  x: number;
  y: number;
  z: number;
}

