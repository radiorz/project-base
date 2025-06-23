import { Description } from "@tikkhun/protocol-core";

export interface StatusCategory extends Description {
  default: number; // 
  module?: string; // 模块名称
  values: Status[]
}

export interface Status extends Description {
  value: number;
}
