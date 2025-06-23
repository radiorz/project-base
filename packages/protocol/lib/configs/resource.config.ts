import { Description } from "../@tikkhun/protocol-core";

export interface Resource extends Description {
  enabled: boolean;
  type: string; 
  
  [key: string]: any;
}

// 资源可以包括一切资源
// 比如外部摄像头 就可以是一种资源
