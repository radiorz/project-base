import { ID } from '@tikkhun/protocol-core';
// 组织信息
export interface OrgConfig {
  domain: string;
  groups: ID[];
  group: string;
  parent: string;
}
