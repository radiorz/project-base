import { Description } from "../@tikkhun/protocol-core";
import { mqttConfig } from "./mqtt.config";
import { networkConfig } from "./network.config";
import { OrgConfig } from "./org.config";
import { Resource } from "./resource.config";
import { SipConfig } from "./sip.config";

export interface DeviceConfig extends Description, OrgConfig {
  // 基础设置
  id: string;  // 设备唯一id sn
  createdAt: string; // 在平台创建时间
  updatedAt: string; // 最后更新时间

  type: string; // 设备类型
  subType?: string;// 具体型号

  version: string; // 版本
  // 调试等
  mode: Mode; // 工作模式
  debug: boolean; // 是否打更多的日志啥的
  // 设备常见设置
  timezone: string; //时区 // "Asia/Shanghai"
  charset: string; // 字符集 utf8
  language: string; // 显示语言
  power: Power; // 电源形式
  auth: any; // 认证

  // 功能设置 实际上设备只要开关，这些配置应该让模块去负责
  network: networkConfig; // 其实都可以是数组[]
  mqtt: mqttConfig;
  sip?: SipConfig;
  resources?: Resource[];
  location?: Location;
  user?: User;
}

interface User {

}
enum Power {
  // 0=其它
  // 1=市电
  // 2=UPS
  // 其它值=其它
  Other = 0,
  AC = 1,
  UPS = 2,
}

enum Mode {
  development,
  preview,
  production
}
