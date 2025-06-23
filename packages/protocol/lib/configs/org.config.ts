import { ID } from "../../core/id";
// 组织信息
export interface OrgConfig {

  domain: string;
  groups: ID[];
  group: string;
  parent: string;
}
