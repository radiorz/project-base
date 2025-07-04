import { Description } from '@/core';

export interface StatusCategory extends Description {
  default: number | string; //
  module?: string; // 模块名称
  values: Status[];
}

export interface Status extends Description {
  value: number | string;
}
